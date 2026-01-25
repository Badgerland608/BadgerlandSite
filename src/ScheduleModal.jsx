import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { supabase } from './lib/supabaseClient';

export default function ScheduleModal({ setShowModal, user }) {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    service: '',
    detergent: '',
    notificationPreference: '',
    bags: '',
    estimate: 0
  });

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState('');
  const [formComplete, setFormComplete] = useState(false);

  const timeSlots = [
    '5:30 AM - 7:30 AM',
    '8:00 AM - 10:00 AM',
    '10:30 AM - 12:30 PM',
    '1:00 PM - 3:00 PM',
    '3:30 PM - 5:30 PM',
    '6:00 PM - 8:00 PM',
  ];

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user.id)
        .single();

      const email = user.email || '';

      if (!error && data) {
        setFormData((prev) => ({
          ...prev,
          fullName: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          email
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          email
        }));
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "bags") {
      const bagsNum = parseInt(value) || 0;
      const lbsPerBag = 15;
      const basePrice = 24;
      const extraRate = 1.60;
      const totalLbs = bagsNum * lbsPerBag;

      let estimate = basePrice;
      if (totalLbs > 15) {
        estimate = basePrice + (totalLbs - 15) * extraRate;
      }

      updated.estimate = Math.round(estimate * 100) / 100;
    }

    setFormData(updated);

    const isComplete = Object.values(updated)
      .filter((v) => typeof v === "string")
      .every((val) => val.trim() !== '');
    setFormComplete(isComplete);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.functions.invoke("order-notify", {
      body: {
        user_id: user?.id ?? null,
        full_name: formData.fullName,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        detergent: formData.detergent,
        dryer_sheets: document.getElementById('dryerSheets').checked,
        instructions: document.querySelector('textarea').value,
        pickup_date: selectedDate?.toISOString().split('T')[0],
        pickup_time: selectedTime,
        notification_preference: formData.notificationPreference,
        bags: formData.bags,
        estimate: formData.estimate,
        status: "pending"
      }
    });

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      alert("Something went wrong. Check the console.");
      return;
    }

    alert('Pickup scheduled! You will receive a confirmation email or text.');
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[3000] px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">

        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800 text-center">
          Schedule a Pickup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm text-purple-900">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="text" name="address" placeholder="Pickup Address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />

          <label className="block text-sm font-medium text-purple-700">
            Please select which service you're requesting.
          </label>
          <select name="service" value={formData.service} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select Service</option>
            <option value="residential">Residential Wash & Fold</option>
            <option value="commercial">Commercial Laundry</option>
          </select>

          <label className="block text-sm font-medium text-purple-700">
            How many bags/loads?
          </label>
          <select
            name="bags"
            value={formData.bags}
            onChange={handleChange}
            className="w-full p-2 border border-purple-300 rounded"
            required
          >
            <option value="">Select amount</option>

            {Array.from({ length: 24 }, (_, i) => {
              const bags = i + 1;
              const lbsPerBag = 15;
              const totalLbs = bags * lbsPerBag;

              const basePrice = 24;
              const extraRate = 1.60;

              let estimate = basePrice;
              if (totalLbs > 15) {
                estimate = basePrice + (totalLbs - 15) * extraRate;
              }

              const rounded = Math.round(estimate * 100) / 100;

              return (
                <option key={bags} value={bags}>
                  {bags} Bags/Loads – {totalLbs} lbs = ${rounded}
                </option>
              );
            })}
          </select>

          {formData.bags && (
            <p className="text-purple-700 font-semibold">
              Estimated Total: <span className="text-purple-900">${formData.estimate}</span>
            </p>
          )}

          <label className="block text-sm font-medium text-purple-700">
            Which detergent would you like us to use?
          </label>
          <select name="detergent" value={formData.detergent} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select Detergent</option>
            <option value="gain">Gain</option>
            <option value="arm-hammer">All *Free & Clear*</option>
            <option value="tide">Tide</option>
          </select>

          {/* Dryer Sheets */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dryerSheets"
              className="h-4 w-4 text-purple-600"
            />
            <label htmlFor="dryerSheets" className="text-sm text-purple-700">
              Add dryer sheets
            </label>
          </div>

          {/* Calendar */}
          <label className="block text-sm font-medium text-purple-700">
            Select a pickup date
          </label>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: new Date() }}
          />

          {/* Time Slots */}
          <label className="block text-sm font-medium text-purple-700">
            Select a pickup time
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`p-2 rounded border ${
                  selectedTime === slot
                    ? 'bg-purple-700 text-white'
                    : 'bg-white text-purple-700 border-purple-300'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          {/* Notification Preference */}
          <label className="block text-sm font-medium text-purple-700">
            How would you like to be notified?
          </label>
          <select
            name="notificationPreference"
            value={formData.notificationPreference}
            onChange={handleChange}
            className="w-full p-2 border border-purple-300 rounded"
            required
          >
            <option value="">Select preference</option>
            <option value="email">Email</option>
            <option value="text">Text Message</option>
          </select>

          {/* Special Instructions */}
          <label className="block text-sm font-medium text-purple-700">
            Special instructions
          </label>
          <textarea
            className="w-full p-2 border border-purple-300 rounded"
            placeholder="Any special notes for your driver?"
          ></textarea>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formComplete || !selectedDate || !selectedTime}
            className="w-full bg-purple-700 text-white py-2 rounded font-semibold disabled:opacity-50"
          >
            Schedule Pickup
          </button>
        </form>
      </div>
    </div>
  );
}
