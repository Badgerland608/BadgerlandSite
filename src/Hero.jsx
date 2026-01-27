import React from 'react';
import heroImg from './assets/HeroImage1.jpg';

function Hero({ setShowModal }) {
  return (
    <section className="relative py-16 px-6 text-center overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImg})`,
          filter: 'brightness(1.15)' // slight boost for readability
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-purple-800 bg-opacity-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-semibold text-green-800 mb-6 leading-tight tracking-normal md:tracking-tight text-outline-silver">
          Wash & Fold Laundry Service in Dane County
        </h1>

        <p className="text-lg md:text-xl text-neutral-800 leading-relaxed mb-10">
          Fast, affordable pickup & delivery laundry service for busy families,
          students, and professionals. Fresh, folded laundry delivered right to
          your door — the very next day.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-700 text-white font-medium px-10 py-3 rounded-full shadow-md hover:bg-purple-800 transition"
        >
          Schedule Your Pickup
        </button>

        {/* Trust Bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-neutral-900 text-sm md:text-base">
          <span className="bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-sm">
            Next‑Day Delivery
          </span>
          <span className="bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-sm">
            Locally Owned
          </span>
          <span className="bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-sm">
            Free Pickup
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
