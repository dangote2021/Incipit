// ─────────────────────────────────────────────────────────────────────────────
// POST /api/stripe/webhook — réception des événements Stripe.
//
// Événements traités :
//   - checkout.session.completed   → premium activé
//   - customer.subscription.updated → statut / période mis à jour
//   - customer.subscription.deleted → premium retiré (fin de période)
//
// Signature vérifiée via STRIPE_WEBHOOK_SECRET.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeServer } from "@/lib/stripe/server";
import { adminSupabase } from "@/lib/supabase/server";
import { hasStripe } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
// Important : on lit le body brut pour la vérif signature
export const runtime = "nodejs";

async function upsertPremium(
  stripe: Stripe,
  admin: NonNullable<ReturnType<typeof adminSupabase>>,
  subscriptionId: string
) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = (sub.metadata?.user_id as string | undefined) ?? null;
  if (!userId) {
    // Fallback : cherche via customer.
    const customerId =
      typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const { data } = await admin
      .from("incipit_premium")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (!data?.user_id) {
      console.warn("[stripe/webhook] subscription without user_id", subscriptionId);
      return;
    }
    await writePremium(admin, data.user_id, sub);
    return;
  }
  await writePremium(admin, userId, sub);
}

async function writePremium(
  admin: NonNullable<ReturnType<typeof adminSupabase>>,
  userId: string,
  sub: Stripe.Subscription
) {
  const active = sub.status === "active" || sub.status === "trialing";
  await admin.from("incipit_premium").upsert(
    {
      user_id: userId,
      is_premium: active,
      activated_at: active ? new Date().toISOString() : null,
      trial_ends_at: sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null,
      stripe_customer_id:
        typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      stripe_subscription_id: sub.id,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    },
    { onConflict: "user_id" }
  );
}

export async function POST(req: Request) {
  if (!hasStripe()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const stripe = stripeServer();
  const admin = adminSupabase();
  if (!stripe || !admin) {
    return NextResponse.json({ error: "misconfigured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[stripe/webhook] invalid signature:", msg);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          await upsertPremium(
            stripe,
            admin,
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id
          );
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        await writePremium(
          admin,
          (sub.metadata?.user_id as string) ??
            (await resolveUserFromCustomer(admin, sub.customer)),
          sub
        );
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId =
          (sub.metadata?.user_id as string | undefined) ??
          (await resolveUserFromCustomer(admin, sub.customer));
        if (userId) {
          await admin
            .from("incipit_premium")
            .update({
              is_premium: false,
              stripe_subscription_id: null,
              current_period_end: new Date(
                sub.current_period_end * 1000
              ).toISOString(),
            })
            .eq("user_id", userId);
        }
        break;
      }
      default:
        // Ignored events (invoice.*, etc.) — pas critiques pour notre usage.
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] handler error:", err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function resolveUserFromCustomer(
  admin: NonNullable<ReturnType<typeof adminSupabase>>,
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): Promise<string> {
  const customerId = typeof customer === "string" ? customer : customer.id;
  const { data } = await admin
    .from("incipit_premium")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return (data?.user_id as string | undefined) ?? "";
}
