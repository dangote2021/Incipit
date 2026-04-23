// POST /api/stripe/portal — ouvre le Customer Portal (cancel, change carte…)
import { NextResponse } from "next/server";
import { serverSupabase, adminSupabase } from "@/lib/supabase/server";
import { stripeServer } from "@/lib/stripe/server";
import { siteUrl, hasStripe } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!hasStripe()) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }
  const supabase = serverSupabase();
  if (!supabase) return NextResponse.json({ error: "auth_not_configured" }, { status: 503 });

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const stripe = stripeServer();
  const admin = adminSupabase();
  if (!stripe || !admin) return NextResponse.json({ error: "misconfigured" }, { status: 503 });

  const { data: prem } = await admin
    .from("premium")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!prem?.stripe_customer_id) {
    return NextResponse.json({ error: "no_customer" }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: prem.stripe_customer_id,
    return_url: `${siteUrl()}/profile`,
  });

  return NextResponse.json({ url: session.url });
}
