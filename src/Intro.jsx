
import React from 'react';

function Intro() {
  return (
    <section className="relative z-10 py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">

        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-purple-700 font-bold uppercase tracking-widest text-sm mb-3">
            Laundry Made Easier
          </p>

          <h2 className="text-3xl md:text-4xl text-purple-900 font-bold mb-6">
            Reliable Laundry Service for Local Businesses & Homes
          </h2>

          <p className="text-slate-600 leading-relaxed text-lg">
            Badgerland Laundry provides dependable wash-and-fold laundry
            with convenient pickup and delivery throughout our service area.
            We help local businesses keep towels, linens, bedding, and uniforms
            clean and ready, while giving households more time back in their day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
            <h3 className="text-xl font-bold text-purple-900 mb-3">
              Commercial Laundry
            </h3>

            <p className="text-slate-700 leading-relaxed">
              Flexible pickup and delivery for businesses that need dependable
              laundry support. Whether you need recurring service or occasional
              help, we'll work with your operation.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-purple-900 mb-3">
              Residential Wash & Fold
            </h3>

            <p className="text-slate-700 leading-relaxed">
              Spend less time doing laundry. We'll pick up your household
              laundry, wash, dry, and fold it, then deliver it back to your door.
            </p>
          </div>

        </div>

        <div className="text-center mt-10">
          <h3 className="text-lg font-bold text-purple-900 mb-2">
            Serving Madison, Sun Prairie & Surrounding Dane County Communities
          </h3>

          <p className="text-slate-500 text-sm leading-relaxed">
            Middleton, Fitchburg, Verona, Monona, Waunakee, DeForest,
            Windsor, Cottage Grove, McFarland, and Stoughton.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Intro;
