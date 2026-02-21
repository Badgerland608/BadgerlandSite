import React from "react";

export default function Plans() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-800 text-center mb-8">
        Subscription Plans
      </h1>

      <p className="text-center text-gray-700 mb-10">
        Choose a plan that fits your household. All plans include free pickup & delivery.
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Light Load Plan */}
        <div className="border rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Single/Student Plan</h2>
          <p className="text-gray-700 mb-1">• 80 lbs included per month</p>
          <p className="text-gray-700 mb-1">• 1 pickup per month</p>
          <p className="text-gray-700 mb-1">• Priority scheduling</p>
          <p className="text-gray-700 mb-1">• 2 Free laundry bags</p>
          <p className="text-gray-700 mb-1">• $1.50/lb overage</p>
          <p className="text-gray-900 font-bold text-lg mt-2">$119 / month</p>

          <a
            href="https://buy.stripe.com/7sY9ASeuY83n5n55AX0Jq06"
            className="mt-auto bg-purple-700 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Subscribe
          </a>
        </div>


        {/* Family Plan */}
        <div className="border rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Family Plan</h2>
          <p className="text-gray-700 mb-1">• 200 lbs included per month</p>
          <p className="text-gray-700 mb-1">• 2 pickups per month</p>
          <p className="text-gray-700 mb-1">• Priority scheduling</p>
          <p className="text-gray-700 mb-1">• 2 free laundry bags</p>
          <p className="text-gray-700 mb-1">• $1.50/lb overage</p>
          <p className="text-gray-900 font-bold text-lg mt-2">$239 / month</p>

          <a
            href="https://buy.stripe.com/eVqcN4cmQ5Vf4j15AX0Jq07"
            className="mt-auto bg-purple-700 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Subscribe
          </a>
        </div>

        {/* Household Plan */}
        <div className="border rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Household Plan</h2>
          <p className="text-gray-700 mb-1">• 260 lbs included per month</p>
          <p className="text-gray-700 mb-1">• 3 Pickups per month</p>
          <p className="text-gray-700 mb-1">• Priority scheduling</p>
          <p className="text-gray-700 mb-1">• 3 free laundry bags</p>
          <p className="text-gray-700 mb-1">• $1.50/lb overage</p>
          <p className="text-gray-900 font-bold text-lg mt-2">$299 / month</p>

          <a
            href="https://buy.stripe.com/fZu14maeI1EZ2aTe7t0Jq08"
            className="mt-auto bg-purple-700 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Subscribe
          </a>
        </div>

        {/* Household Plan */}
        <div className="border rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-purple-700 mb-2"> Ultra Household Plan</h2>
          <p className="text-gray-700 mb-1">• 320 lbs included per month</p>
          <p className="text-gray-700 mb-1">• 4 Pickups per month</p>
          <p className="text-gray-700 mb-1">• Priority scheduling</p>
          <p className="text-gray-700 mb-1">• 4 free laundry bags</p>
          <p className="text-gray-700 mb-1">• $1.50/lb overage</p>
          <p className="text-gray-900 font-bold text-lg mt-2">$349 / month</p>

          <a
            href="https://buy.stripe.com/fZu14maeI1EZ2aTe7t0Jq08"
            className="mt-auto bg-purple-700 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Subscribe
          </a>
        </div>

      </div>
    </div>
  );
}