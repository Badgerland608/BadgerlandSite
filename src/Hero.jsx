import React, { useState } from 'react';
import ScheduleModal from './ScheduleModal'; // Adjust path if needed

function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="bg-gradient-to-r from-purple-100 to-white py-12 text-center">
      <h2 className="text-3xl font-bold text-purple-900 mb-4">
        Badgerland Laundry
      </h2>

      <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto">
        Convenient, affordable, and professional laundry care for your home or business.
      </p>

      <button
        onClick={() => setShowModal(true)}
        className="inline-block bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold text-lg px-9 py-3 rounded-full shadow-md hover:from-purple-700 hover:to-purple-500 transition-all duration-200"
      >
        Schedule a Pickup
      </button>

      {showModal && <ScheduleModal setShowModal={setShowModal} />}
    </section>
  );
}

export default Hero;