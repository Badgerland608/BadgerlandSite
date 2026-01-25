import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { supabase } from './lib/supabaseClient';

export default function ScheduleModal({ setShowModal }) {
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
    '5:30 AM - 7:30 AM','8:00 AM - 10:00 AM','10:30 AM - 12:30 PM',
    '1:00 PM - 3:00 PM','3:30 PM - 5:30 PM','6:00 PM - 8:00 PM',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    // ⭐ OPTION B PRICING LOGIC
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

    const { data, error } = await supabase.functions.invoke("order-notify", {
      body: {
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
    <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800 text-center">
          Schedule a Pickup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm text-purple-900">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="text" name="address" placeholder="Pickup Address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />

          {/* SERVICE */}
          <select name="service" value={formData.service} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select Service</option>
            <option value="residential">Residential Wash & Fold</option>
            <option value="commercial">Commercial Laundry</option>
          </select>

          {/* ⭐ BAGS / LOADS SELECTOR */}
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
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>

          {/* ⭐ ESTIMATE DISPLAY */}
          {formData.bags && (
            <p className="text-purple-700 font-semibold">
              Estimated Cost: <span className="text-purple-900">${formData.estimate}</span>
            </p>
          )}

          {/* DETERGENT */}
          <select name="detergent" value={formData.detergent} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select Detergent</option>
            <option value="gain">Gain</option>
            <option value="arm-hammer">Arm & Hammer</option>
            <option value="tide">Tide</option>
          </select>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="dryerSheets" className="h-4 w-4 text-purple-600" />
            <label htmlFor="dryerSheets" className="text-sm text-purple-700">Include Dryer Sheets</label>
          </div>

          <textarea placeholder="Special Instructions" className="w-full p-2 border border-purple-300 rounded" rows={3} />

          {/* Notification Preference */}
          <label className="block text-sm font-medium text-purple-700 mb-2">
            How would you like to receive updates?
          </label>
          <select
            name="notificationPreference"
            value={formData.notificationPreference}
            onChange={handleChange}
            className="w-full p-2 border border-purple-300 rounded"
            required
          >
            <option value="">Choose one</option>
            <option value="email">Email</option>
            <option value="sms">Text Message</option>
            <option value="both">Both</option>
          </select>

          {formComplete && (
            <>
              <label className="block text-sm font-medium text-purple-700 mt-4">Select a Pickup Date</label>
              <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} />

              {selectedDate && (
                <>
                  <label className="block text-sm font-medium text-purple-700 mt-4">Select a Time Slot</label>
                  <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-2 border border-purple-300 rounded" required>
                    <option value="">Choose a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </>
              )}
            </>
          )}

          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition">
            Submit Request
          </button>
        </form>

        <button onClick={() => setShowModal(false)} className="mt-4 text-xs text-purple-500 hover:underline block text-center">
          Cancel
        </button>
      </div>
    </div>
  );
}
