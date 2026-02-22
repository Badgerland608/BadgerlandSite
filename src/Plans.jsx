import React from "react";
import { supabase } from "./lib/supabaseClient";

export default function Plans({ user }) {

  async function handleSubscribe(priceId) {
    if (!user) {
      alert("Please sign in before subscribing.");
      return;
    }

    const { data, error } = await supabase.functions.invoke(
      "create-checkout-session",
      {
        body: {
          priceId,
          user_id: user.id,
        },
      }
    );

    if (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong starting your subscription.");
      return;
    }

    window.location.href = data.url;
  }

  const plans = [
    {
      name: "Single/Student Plan",
      lbs: "80 lbs",
      pickups: "1 pickup",
      bags: "2 free laundry bags",
      price: "$119 / month",
      priceId: "price_1T3OU9B2WXwuC0HNhpy2L1OP", // ← replace with your real Stripe price ID
    },
    {
      name: "Family Plan",
      lbs: "200 lbs",
      pickups: "2 pickups",
      bags: "2 free laundry bags",
      price: "$239 / month",
      priceId: "price_1T3OUHB2WXwuC0HNnRZcqih2", // ← replace with your real Stripe price ID
    },
    {
      name: "Household Plan",
      lbs: "260 lbs",
      pickups: "3 pickups",
      bags: "3 free laundry bags",
      price: "$299 / month",
      priceId: "price_1T3OUOB2WXwuC0HNadqqEet1", // ← replace with your real Stripe price ID
    },
    {
      name: "Ultra Household Plan",
      lbs: "320 lbs",
      pickups: "4 pickups",
      bags: "4 free laundry bags",
      price: "$349 / month",
      priceId: "price_1T3OUWB2WXwuC0HNMWa7QhTR", // ← replace with your real Stripe price ID
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-[#804FB3] text-center mb-6 tracking-tight">
        Subscription Plans
      </h1>

      <p className="text-center text-gray-600 mb-12 text-lg">
        Choose a plan that fits your household. All plans include free pickup & delivery.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {plans.map((plan, i) => (
          <div
            key={i}
            className="
              w-full rounded-2xl p-7 flex flex-col
              border border-[#CFCFCF]
              shadow-lg
              bg-gradient-to-b from-[#FFFFFF] to-[#E5E4E2]
              hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
            "
          >
            <h2 className="text-xl font-semibold text-[#804FB3] mb-3 text-center">
              {plan.name}
            </h2>

            <div className="h-1 w-16 bg-[#56941E] mx-auto rounded-full mb-4"></div>

            <div className="text-gray-700 space-y-1 text-center">
              <p>• {plan.lbs} included per month</p>
              <p>• {plan.pickups} per month</p>
              <p>• Priority scheduling</p>
              <p>• {plan.bags}</p>
              <p>• $1.50/lb overage</p>
            </div>

            <p className="text-gray-900 font-bold text-2xl mt-4 text-center">
              {plan.price}
            </p>

            <button
              onClick={() => handleSubscribe(plan.priceId)}
              className="
                mt-6 text-white text-center py-2.5 rounded-xl font-semibold
                bg-gradient-to-r from-[#804FB3] to-[#56941E]
                hover:opacity-90 transition shadow-md
              "
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}