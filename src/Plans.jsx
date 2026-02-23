import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Plans({ user }) {
  const [loadingPlan, setLoadingPlan] = useState(null);

  async function handleSubscribe(plan) {
    if (!user) {
      alert("Please signup to start a subscription plan.");
      return;
    }

    setLoadingPlan(plan.basePriceId);

    try {
      // .invoke() automatically attaches the current session's JWT 
      // and your project's anon key for you.
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          basePriceId: plan.basePriceId,
          meteredPriceId: plan.meteredPriceId,
          user_id: user.id,
          customerEmail: user.email,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect the user to the Stripe-hosted checkout page
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from the server.");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert(err.message || "Something went wrong starting your subscription.");
    } finally {
      setLoadingPlan(null);
    }
  }

  const plans = [
    {
      name: "Single/Student Plan",
      lbs: "80 lbs",
      pickups: "1 pickup",
      bags: "2 free laundry bags",
      price: "$119 / month",
      basePriceId: "price_1T3OU9B2WXwuC0HNhpy2L1OP",
      meteredPriceId: "price_1T3nQvB2WXwuC0HNnzE2lP7W",
    },
    {
      name: "Family Plan",
      lbs: "200 lbs",
      pickups: "2 pickups",
      bags: "2 free laundry bags",
      price: "$239 / month",
      basePriceId: "price_1T3OUHB2WXwuC0HNnRZcqih2",
      meteredPriceId: "price_1T3nUtB2WXwuC0HNnWJkgeSN",
    },
    {
      name: "Household Plan",
      lbs: "260 lbs",
      pickups: "3 pickups",
      bags: "3 free laundry bags",
      price: "$299 / month",
      basePriceId: "price_1T3OUOB2WXwuC0HNadqqEet1",
      meteredPriceId: "price_1T3nWJB2WXwuC0HNuCLz9CGI",
    },
    {
      name: "Ultra Household Plan",
      lbs: "320 lbs",
      pickups: "4 pickups",
      bags: "4 free laundry bags",
      price: "$349 / month",
      basePriceId: "price_1T3OUWB2WXwuC0HNMWa7QhTR",
      meteredPriceId: "price_1T3nY4B2WXwuC0HN6a9aELDW",
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

            <div className="text-gray-700 space-y-1 text-center flex-grow">
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
              onClick={() => handleSubscribe(plan)}
              disabled={loadingPlan === plan.basePriceId}
              className={`
                mt-6 text-white text-center py-2.5 rounded-xl font-semibold
                bg-gradient-to-r from-[#804FB3] to-[#56941E]
                hover:opacity-90 transition shadow-md
                ${loadingPlan === plan.basePriceId ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loadingPlan === plan.basePriceId ? "Loading..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}