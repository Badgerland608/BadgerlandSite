import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "stripe" // Uses the alias from deno.json

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS })
  }

  try {
    // 2. Initialize Stripe with Deno-specific HTTP client
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set in Supabase secrets.")
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(), // Prevents connection hangs in Deno
    })

    // 3. Parse and Validate Request
    const { basePriceId, meteredPriceId, user_id } = await req.json()

    if (!basePriceId || !meteredPriceId || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: basePriceId, meteredPriceId, or user_id" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      )
    }

    // 4. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: basePriceId, quantity: 1 },
        { price: meteredPriceId }, // Metered billing (usage-based)
      ],
      success_url: "https://www.badgerlandlaundry.com/success",
      cancel_url: "https://www.badgerlandlaundry.com/plans",
      metadata: { user_id },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200, 
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      }
    )

  } catch (err) {
    console.error("Function Crash:", err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500, // This is what you see in the logs
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      }
    )
  }
})