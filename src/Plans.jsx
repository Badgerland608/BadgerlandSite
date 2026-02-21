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
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Light Load</h2>
          <p className="text-gray-700 mb-1">• 60 lbs included per month</p>
          <p className="text-gray-700 mb-1">• 1 pickup per month</p>
          <p className="text-gray-700 mb-1">• Free pickup & delivery</p>
          <p className="text-gray-700 mb-1">• Priority scheduling</p>
          <p className="text-gray-700 mb-1">• $1.60/lb overage</p>
          <p className="text-gray-900 font-bold text-lg mt-2">$89 / month</p>

          <a
            href="https://buy.stripe.com/dRm7sKdqU83n02L7J50Jq01"
            className="mt-auto bg-purple-700 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Subscribe
          </a>
        </div>

        {/* Family Plan */}
        <div className="border rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Family Plan</h2>
          <p className="text-gray-700 mb-1">• 120 lbs included per month</p>
          <p className="text-gray-700 mb-1">• 2 Pickups per month</p>
          <p className="text-gray-700 mb-1">• Free pickup & delivery</p>
          <p className="text-gray-700 mb-1">• Priority scheduling</p>
          <p className="text-gray-700 mb-1">• $1.50/lb overage</p>
          <p className="text-gray-900 font-bold text-lg mt-2">$159 / month</p>

          <a
            href="https://buy.stripe.com/8x2dR8euY2J3g1Jfbx0Jq05"
            className="mt-auto bg-purple-700 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Subscribe
          </a>
        </div>

        {/* Household Plan */}
        <div className="border rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Household Plan</h2>
          <p className="text-gray-700 mb-1">• 200 lbs included per month</p>
          <p className="text-gray-700 mb-1">• 4 Pickups per month</p>
          <p className="text-gray-700 mb-1">• Free pickup & delivery</p>
          <p className="text-gray-700 mb-1">• Priority scheduling</p>
          <p className="text-gray-700 mb-1">• $1.50/lb overage</p>
          <p className="text-gray-900 font-bold text-lg mt-2">$239 / month</p>

          <a
            href="https://buy.stripe.com/7sY4gy3Qk4Rb7vdbZl0Jq04"
            className="mt-auto bg-purple-700 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Subscribe
          </a>
        </div>

      </div>
    </div>
  );
}