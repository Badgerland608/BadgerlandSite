
import React from 'react';
import { Link } from 'react-router-dom';

function FinalCTA() {
  return (
    <section className="bg-purple-950 py-20 px-4 text-center text-white">
      <div className="max-w-4xl mx-auto">

        <p className="text-purple-200 font-bold uppercase tracking-widest text-sm mb-4">
          Let's Make Laundry Easier
        </p>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Less Time Managing Laundry. More Time Running Your Business.
        </h2>

        <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          From recurring commercial laundry service to convenient
          household wash and fold, Badgerland Laundry is ready to help.
          We pick up, clean, fold, and deliver.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/commercial"
            className="bg-white text-purple-950 font-bold px-9 py-4 rounded-full shadow-md hover:bg-purple-100 transition"
          >
            Request a Commercial Quote
          </Link>

          <Link
            to="/residential"
            className="border-2 border-white text-white font-semibold px-9 py-4 rounded-full hover:bg-white/10 transition"
          >
            Residential Laundry Service
          </Link>
        </div>

        <p className="text-purple-200 text-sm mt-8">
          Serving Madison, Sun Prairie, and surrounding Dane County communities.
        </p>

      </div>
    </section>
  );
}

export default FinalCTA;
