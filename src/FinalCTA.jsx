import React from 'react';

function FinalCTA() {
  return (
    <section className="bg-purple-900 py-20 text-center text-white">
      <h3 className="text-3xl font-bold mb-4">
        Ready to Skip Laundry Day?
      </h3>

      <p className="text-lg mb-10 max-w-xl mx-auto px-4 leading-relaxed">
        Fresh, folded laundry delivered right to your door — fast, affordable, and hassle‑free.
      </p>

      <button
        className="bg-white text-purple-900 font-semibold px-10 py-3 rounded-full shadow-md hover:bg-purple-100 transition"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Schedule Your Pickup
      </button>
    </section>
  );
}

export default FinalCTA;
