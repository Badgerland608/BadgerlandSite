
import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from './assets/HeroImage2.jpg';

function Hero() {
  return (
    <section className="relative py-20 md:py-28 px-6 text-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      ></div>

      {/* Readability Overlay */}
      <div className="absolute inset-0 bg-white/65"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <p className="text-purple-800 font-bold uppercase tracking-widest text-sm mb-4">
          Locally Owned • Dane County, Wisconsin
        </p>

        <h1 className="text-4xl md:text-6xl font-bold text-purple-950 mb-6 leading-tight">
          Laundry Pickup & Delivery for Businesses and Homes
        </h1>

        <p className="text-lg md:text-xl text-neutral-800 leading-relaxed mb-8 max-w-3xl mx-auto">
          From recurring commercial laundry to everyday household wash and fold,
          Badgerland Laundry picks up, cleans, folds, and delivers.
          Let us take laundry off your hands.
        </p>

        {/* Primary Commercial CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/commercial"
            className="bg-purple-800 text-white font-semibold px-9 py-4 rounded-full shadow-md hover:bg-purple-900 transition"
          >
            Commercial Laundry Quotes
          </Link>

          <Link
            to="/residential"
            className="bg-white text-purple-900 border-2 border-purple-800 font-semibold px-9 py-4 rounded-full shadow-md hover:bg-purple-50 transition"
          >
            Residential Laundry Service
          </Link>
        </div>

        {/* Trust Bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-neutral-900 text-sm md:text-base">
          <span className="bg-white/90 px-4 py-2 rounded-full shadow-sm">
            Pickup & Delivery
          </span>

          <span className="bg-white/90 px-4 py-2 rounded-full shadow-sm">
            Commercial & Residential
          </span>

          <span className="bg-white/90 px-4 py-2 rounded-full shadow-sm">
            Serving Dane County
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
