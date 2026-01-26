import React from 'react';
import pickupImg from './assets/IMG_0917.jpg';

function HowItWorks() {
  return (
    <section className="bg-gray-100 py-12 text-center">
      <h3 className="text-3xl font-bold text-purple-900 mb-10">
        How It Works
      </h3>

      <div className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto">

        {/* Step 1 */}
        <div className="flex-1 min-w-[240px] max-w-[300px]">
          <h1 className="text-3xl text-purple-600 font-bold mb-2">Step 1</h1>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-5xl text-purple-600 mb-4">📅</div>
            <h4 className="text-xl font-semibold mb-3">Schedule Pickup</h4>
            <p className="text-gray-700 text-base leading-relaxed">
              Choose a pickup time that fits your schedule — mornings, evenings, or same‑day options.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex-1 min-w-[240px] max-w-[300px]">
          <h1 className="text-3xl text-purple-600 font-bold mb-2">Step 2</h1>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
            <img
              src={pickupImg}
              alt="Pickup"
              className="h-[200px] w-[240px] object-cover rounded-md mb-4 shadow-md"
            />
            <h4 className="text-xl font-semibold mb-3">We Wash & Fold</h4>
            <p className="text-gray-700 text-base leading-relaxed">
              Your laundry is washed, dried, folded, and packaged neatly using premium detergents.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex-1 min-w-[240px] max-w-[300px]">
          <h1 className="text-3xl text-purple-600 font-bold mb-2">Step 3</h1>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-5xl text-purple-600 mb-4">🧺</div>
            <h4 className="text-xl font-semibold mb-3">Delivery to Your Door</h4>
            <p className="text-gray-700 text-base leading-relaxed">
              We bring your clean laundry back the next day — fresh, folded, and ready to put away.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
