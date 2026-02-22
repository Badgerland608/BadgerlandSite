import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@12.18.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info, user-agent, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform, referer",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // ⭐ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { basePriceId, meteredPriceId, user_id } = await req.json();

    if (!basePriceId || !meteredPriceId || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing price IDs or user_id" }),
        {
          status: 400,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: basePriceId, quantity: 1 },
        { price: meteredPriceId, quantity: 1 },
      ],
      success_url: "https://www.badgerlandlaundry.com/success",
      cancel_url: "https://www.badgerlandlaundry.com/plans",
      metadata: { user_id },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });

  } catch (err) {
    console.error("Checkout error:", err);

    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }
});