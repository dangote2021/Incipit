// ─────────────────────────────────────────────────────────────────────────────
// POST /api/stripe/checkout — crée une session Checkout et renvoie l'URL.
//
// L'utilisateur doit être connecté (sinon on redirige vers /auth/login).
// On attache le customer_id Stripe au profile pour le retrouver au webhook.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { serverSupabase, adminSupabase } from "@/lib/supabase/server";
import { stripeServer } from "@/lib/stripe/server";
import { siteUrl, hasStripe } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!hasStripe()) {
    return NextResponse.json(
      { error: "stripe_not_configured" },
      { status: 503 }
    );
  }

  const supabase = serverSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "auth_not_configured" },
      { status: 503 }
    );
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const stripe = stripeServer();
  const admin = adminSupabase();
  if (!stripe || !admin) {
    return NextResponse.json({ error: "misconfigured" }, { status: 503 });
  }

  // 1. Récupère ou crée le customer Stripe.
  const { data: prem } = await admin
    .from("incipit_premium")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = prem?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await admin.from("incipit_premium").upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      is_premium: false,
    });
  }

  // 2. Crée la Checkout Session.
  const site = siteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      { price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!, quantity: 1 },
    ],
    success_url: `${site}/premium?success=1`,
    cancel_url: `${site}/premium?canceled=1`,
    allow_promotion_codes: true,
    locale: "fr",
    subscription_data: {
      metadata: { user_id: user.id },
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "no_url" }, { status: 500 });
  }
  return NextResponse.json({ url: session.url });
}
