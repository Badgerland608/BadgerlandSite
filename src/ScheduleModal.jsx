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
    estimate: 0,
    dryerSheets: false,
    instructions: ''
  });

  const [subscription, setSubscription] = useState(null);

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState('');
  const [formComplete, setFormComplete] = useState(false);

  const [slotCounts, setSlotCounts] = useState({});
  const MAX_PER_SLOT = 5;

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:30 AM - 12:30 PM',
    '1:00 PM - 3:00 PM',
    '4:00 PM - 6:00 PM',
  ];

  // Force next-day scheduling
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Load profile + subscription
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user.id)
        .single();

      const email = user.email || '';

      if (profile) {
        setFormData((prev) => ({
          ...prev,
          fullName: profile.full_name || '',
          phone: profile.phone || '',
          address: profile.address || '',
          email
        }));
      } else {
        setFormData((prev) => ({ ...prev, email }));
      }

      // Load subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (sub) setSubscription(sub);
    };

    loadProfile();
  }, [user]);

  // Load slot counts when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const loadCounts = async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('orders')
        .select('pickup_time')
        .eq('pickup_date', dateStr);

      if (error) {
        console.error("Error loading slot counts:", error);
        return;
      }

      const counts = {};
      data.forEach((order) => {
        counts[order.pickup_time] = (counts[order.pickup_time] || 0) + 1;
      });

      setSlotCounts(counts);
    };

    loadCounts();
  }, [selectedDate]);

  const isSlotFull = (slot) => (slotCounts[slot] || 0) >= MAX_PER_SLOT;
  const spotsLeft = (slot) => Math.max(MAX_PER_SLOT - (slotCounts[slot] || 0), 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value
    };

    // Subscription-aware pricing
    if (name === "bags") {
      const bagsNum = parseInt(value) || 0;
      const lbsPerBag = 15;
      const totalLbs = bagsNum * lbsPerBag;

      let estimate = 24; // base price

      if (subscription) {
        const included = subscription.included_lbs;
        const extraRate = subscription.extra_rate;

        if (totalLbs > included) {
          estimate = 24 + (totalLbs - included) * extraRate;
        }
      } else {
        // Standard pricing
        if (totalLbs > 15) {
          estimate = 24 + (totalLbs - 15) * 1.60;
        }
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

  if (isSlotFull(selectedTime)) {
    alert("That time slot is full. Please choose another.");
    return;
  }

  const pickupDate = selectedDate.toISOString().split("T")[0];

  const response = await fetch(
    "https://tuivdahifcmsybdyggnn.supabase.co/functions/v1/order-notify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user?.id || null,
        full_name: formData.fullName,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        pickup_date: pickupDate,
        pickup_time: selectedTime,
        notification_preference: formData.notificationPreference,
        detergent: formData.detergent,
        dryer_sheets: formData.dryerSheets,
        instructions: formData.instructions,
        service: formData.service,
        bags: formData.bags,
        estimate: formData.estimate
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Function error:", result);
    alert("Something went wrong. Try again.");
    return;
  }

  alert("Pickup scheduled! You will receive updates automatically.");
  setShowModal(false);
};

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[3000] px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">

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

          {/* Profile fields */}
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="text" name="address" placeholder="Pickup Address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />

          {/* Service */}
          <label className="block text-sm font-medium text-purple-700">Service</label>
          <select name="service" value={formData.service} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select Service</option>
            <option value="residential">Residential Wash & Fold</option>
            <option value="commercial">Commercial Laundry</option>
          </select>

          {/* Bags */}
          <label className="block text-sm font-medium text-purple-700">How many bags?</label>
          <select name="bags" value={formData.bags} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select amount</option>
            {Array.from({ length: 24 }, (_, i) => {
              const bags = i + 1;
              const lbs = bags * 15;

              let estimate = 24;
              if (subscription) {
                if (lbs > subscription.included_lbs) {
                  estimate = 24 + (lbs - subscription.included_lbs) * subscription.extra_rate;
                }
              } else {
                if (lbs > 15) estimate = 24 + (lbs - 15) * 1.60;
              }

              return (
                <option key={bags} value={bags}>
                  {bags} Bags – {lbs} lbs = ${estimate.toFixed(2)}
                </option>
              );
            })}
          </select>

          {formData.bags && (
            <p className="text-purple-700 font-semibold">
              Estimated Total: <span className="text-purple-900">${formData.estimate}</span>
            </p>
          )}

          {/* Detergent */}
          <label className="block text-sm font-medium text-purple-700">Detergent</label>
          <select name="detergent" value={formData.detergent} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select Detergent</option>
            <option value="gain">Gain</option>
            <option value="arm-hammer">All Free & Clear</option>
            <option value="tide">Tide</option>
          </select>

          {/* Dryer sheets */}
          <div className="flex items-center gap-2">
            <input type="checkbox" name="dryerSheets" checked={formData.dryerSheets} onChange={handleChange} className="h-4 w-4 text-purple-600" />
            <label className="text-sm text-purple-700">Add dryer sheets</label>
          </div>

          {/* Date */}
          <label className="block text-sm font-medium text-purple-700">Pickup Date</label>
          <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={{ before: tomorrow }} />

          {/* Time */}
          <label className="block text-sm font-medium text-purple-700">Pickup Time</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const full = isSlotFull(slot);
              const left = spotsLeft(slot);

              return (
                <button
                  type="button"
                  key={slot}
                  disabled={full}
                  onClick={() => !full && setSelectedTime(slot)}
                  className={`p-2 rounded border flex flex-col items-start ${
                    full
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : selectedTime === slot
                      ? 'bg-purple-700 text-white'
                      : 'bg-white text-purple-700 border-purple-300'
                  }`}
                >
                  <span>{slot}</span>
                  <span className="text-xs mt-1">
                    {full ? 'Full'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notification preference */}
          <label className="block text-sm font-medium text-purple-700">Notification Preference</label>
          <select name="notificationPreference" value={formData.notificationPreference} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select preference</option>
            <option value="email">Email</option>
            <option value="text">Text Message</option>
          </select>

          {/* Instructions */}
          <label className="block text-sm font-medium text-purple-700">Special Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="w-full p-2 border border-purple-300 rounded"
            placeholder="Any special notes for your driver?"
          />

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