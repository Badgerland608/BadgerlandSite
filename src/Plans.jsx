import React from "react";

export default function Plans() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-[#804FB3] text-center mb-6 tracking-tight">
        Subscription Plans
      </h1>

      <p className="text-center text-gray-600 mb-12 text-lg">
        Choose a plan that fits your household. All plans include free pickup & delivery.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">

        {[
          {
            name: "Single/Student Plan",
            lbs: "80 lbs",
            pickups: "1 pickup",
            bags: "2 free laundry bags",
            price: "$119 / month",
            link: "https://buy.stripe.com/7sY9ASeuY83n5n55AX0Jq06",
          },
          {
            name: "Family Plan",
            lbs: "200 lbs",
            pickups: "2 pickups",
            bags: "2 free laundry bags",
            price: "$239 / month",
            link: "https://buy.stripe.com/eVqcN4cmQ5Vf4j15AX0Jq07",
          },
          {
            name: "Household Plan",
            lbs: "260 lbs",
            pickups: "3 pickups",
            bags: "3 free laundry bags",
            price: "$299 / month",
            link: "https://buy.stripe.com/fZu14maeI1EZ2aTe7t0Jq08",
          },
          {
            name: "Ultra Household Plan",
            lbs: "320 lbs",
            pickups: "4 pickups",
            bags: "4 free laundry bags",
            price: "$349 / month",
            link: "https://buy.stripe.com/fZu14maeI1EZ2aTe7t0Jq08",
          },
        ].map((plan, i) => (
          <div
            key={i}
            className="
              w-full rounded-2xl p-7 flex flex-col
              border border-[#CFCFCF]
              shadow-lg
              bg-gradient-to-b from-[#FFFFFF] to-[#E5E4E2]   /* Platinum gradient */
              hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
            "
          >
            <h2 className="text-xl font-semibold text-[#804FB3] mb-3 text-center">
              {plan.name}
            </h2>

            {/* Green accent divider */}
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

            <a
              href={plan.link}
              className="
                mt-6 text-white text-center py-2.5 rounded-xl font-semibold
                bg-gradient-to-r from-[#804FB3] to-[#56941E]
                hover:opacity-90 transition shadow-md
              "
            >
              Subscribe
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
