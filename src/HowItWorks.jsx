import React from 'react';
import pickupImg from './assets/IMG_0917.jpg';

function HowItWorks() {
  return (
    <section className="bg-gray-100 py-10 text-center">
      <h3 className="text-2xl font-bold text-purple-900 mb-8">How It Works</h3>

      <div className="flex flex-wrap justify-center gap-10 max-w-4xl mx-auto">
        {/* Step 1 */}
        <div className="flex-1 min-w-[220px] max-w-[300px]">
          <h1 className="text-3g text-purple-600 font-bold mb-2">Step 1</h1>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-4xl text-purple-600 mb-3">📅</div>
            <h4 className="text-lg font-semibold mb-2">Schedule</h4>
            <p className="text-gray-700 text-base">
              Schedule your laundry pickup on our site or through our mobile app. Choose a time that works for you!
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex-1 min-w-[220px] max-w-[300px]">
          <h1 className="text-3g text-purple-600 font-bold mb-2">Step 2</h1>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
            <img
              src={pickupImg}
              alt="Pickup"
              className="h-[200px] w-[240px] object-cover rounded-md mb-3 shadow-md"
            />
            <h4 className="text-lg font-semibold mb-2">Pickup</h4>
            <p className="text-gray-700 text-base">
              We pick up your laundry from your doorstep, no need to be home!
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex-1 min-w-[220px] max-w-[300px]">
          <h1 className="text-3g text-purple-600 font-bold mb-2">Step 3</h1>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-4xl text-purple-600 mb-3">🧺</div>
            <h4 className="text-lg font-semibold mb-2">Clean & Deliver</h4>
            <p className="text-gray-700 text-base">
              We wash, fold, and deliver your laundry fresh and clean—ready to use!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;