// ─────────────────────────────────────────────────────────────────────────────
// Client Stripe côté serveur. Retourne null si non configuré (dev sans clés).
// ─────────────────────────────────────────────────────────────────────────────

import Stripe from "stripe";
import { hasStripe } from "@/lib/supabase/env";

let cached: Stripe | null = null;

export function stripeServer(): Stripe | null {
  if (!hasStripe()) return null;
  if (cached) return cached;
  cached = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
    typescript: true,
  });
  return cached;
}
