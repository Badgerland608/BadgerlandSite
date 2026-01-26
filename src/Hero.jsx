import React from 'react';
import heroImg from './assets/picturemaybe.jpg; // update path if needed

function Hero({ setShowModal }) {
  return (
    <section className="relative text-white py-24 px-6 text-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      ></div>

      {/* Purple Overlay */}
      <div className="absolute inset-0 bg-purple-900 bg-opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Wash & Fold Laundry Service in Dane County
        </h1>

        <p className="text-lg md:text-xl text-purple-100 leading-relaxed mb-10">
          Fast, affordable pickup & delivery laundry service for busy families,
          students, and professionals. Fresh, folded laundry delivered right to
          your door — the very next day.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-purple-900 font-semibold px-10 py-3 rounded-full shadow-md hover:bg-purple-100 transition"
        >
          Schedule Your Pickup
        </button>

        {/* Trust Bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-purple-100 text-sm md:text-base">
