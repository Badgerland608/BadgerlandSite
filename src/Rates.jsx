import React from 'react';

function Rates() {
  return (
    <section className="bg-white py-10 text-center">
      <h3 className="text-2xl font-bold text-purple-900 mb-8">Rates</h3>

      <div className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto px-4">
        {/* Residential */}
        <div className="flex-1 min-w-[220px] max-w-md bg-purple-50 rounded-xl shadow-md p-8">
          <h4 className="text-purple-800 font-semibold text-lg mb-3">Residential</h4>
          <ul className="list-none text-gray-700 text-base space-y-2">
            <li>
              Wash & Fold: <strong>$1.60/lb</strong>
            </li>
            <li>
              Minimum Order: <strong>$24</strong>
            </li>
            <li>Free Pickup & Next-Day Delivery</li>
          </ul>
        </div>

        {/* Commercial */}
        <div className="flex-1 min-w-[220px] max-w-md bg-purple-50 rounded-xl shadow-md p-8">
          <h4 className="text-purple-800 font-semibold text-lg mb-3">Commercial</h4>
          <ul className="list-none text-gray-700 text-base space-y-2">
            <li>Custom Pricing</li>
            <li>Flexible Scheduling</li>
            <li>Contact us for a quote</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Rates;