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
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
  const [selectedTime, setSelectedTime] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [slotCounts, setSlotCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const MAX_PER_SLOT = 5;

  const timeSlots = [
    { label: '8:00 AM - 10:00 AM', hour: 8 },
    { label: '10:30 AM - 12:30 PM', hour: 10.5 },
    { label: '1:00 PM - 3:00 PM', hour: 13 },
    { label: '4:00 PM - 6:00 PM', hour: 16 },
  ];

  // Helper: Check if a slot is in the past (with 2hr buffer)
  const isSlotPast = (slotHour) => {
    const now = new Date();
    const isToday = selectedDate && selectedDate.toDateString() === now.toDateString();
    if (!isToday) return false;

    const currentHour = now.getHours() + now.getMinutes() / 60;
    return slotHour < currentHour + 2; // 2 hour buffer
  };

  function getNextDate(dayName) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetIndex = days.indexOf(dayName);
    if (targetIndex === -1) return null;

    const result = new Date();
    const currentIndex = result.getDay();

    let diff = targetIndex - currentIndex;
    if (diff < 0) diff += 7; // Changed to allow 0 (today)

    result.setDate(result.getDate() + diff);
    return result;
  }

  /* ============================================================
      Load profile + subscription
  ============================================================ */
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          phone: profile.phone || '',
          address: profile.address || '',
          email: user.email || ''
        }));
      }

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (sub) {
        setSubscription(sub);
        if (sub.pickup_day) {
          const next = getNextDate(sub.pickup_day);
          if (next) setSelectedDate(next);
        }
        if (sub.pickup_time) setSelectedTime(sub.pickup_time);
      }
    };

    loadData();
  }, [user]);

  /* ============================================================
      Load slot counts
  ============================================================ */
  useEffect(() => {
    if (!selectedDate) return;

    const loadCounts = async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data } = await supabase
        .from('orders')
        .select('pickup_time')
        .eq('pickup_date', dateStr);

      const counts = {};
      data?.forEach(order => {
        counts[order.pickup_time] = (counts[order.pickup_time] || 0) + 1;
      });
      setSlotCounts(counts);
    };

    loadCounts();
  }, [selectedDate]);

  const isSlotFull = (slotLabel) => (slotCounts[slotLabel] || 0) >= MAX_PER_SLOT;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updated = { ...formData, [name]: type === "checkbox" ? checked : value };

    if (name === "bags") {
      const bagsNum = parseInt(value) || 0;
      const totalLbs = bagsNum * 15;
      let estimate = 24;

      if (subscription) {
        if (totalLbs > subscription.included_lbs) {
          estimate = 24 + (totalLbs - subscription.included_lbs) * subscription.extra_rate;
        }
      } else {
        if (totalLbs > 15) estimate = 24 + (totalLbs - 15) * 1.60;
      }
      updated.estimate = Math.round(estimate * 100) / 100;
    }

    setFormData(updated);
    
    const required = ["fullName", "address", "phone", "email", "detergent", "notificationPreference", "bags"];
    if (!subscription) required.push("service");
    
    const isComplete = required.every(f => updated[f] && updated[f].toString().trim() !== "");
    setFormComplete(isComplete);
  };

  /* ============================================================
      Submit (Order + Stripe Invoice Prep)
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isSlotFull(selectedTime) || isSlotPast(timeSlots.find(s => s.label === selectedTime)?.hour)) {
      alert("This time slot is no longer available. Please pick another.");
      setLoading(false);
      return;
    }

    const pickupDate = selectedDate.toISOString().split("T")[0];

    try {
      // This function should: 
      // 1. Create order in DB
      // 2. Ensure Stripe Customer exists
      // 3. Setup a payment intent or flag for post-weighing charge
      const response = await fetch(
        "https://tuivdahifcmsybdyggnn.supabase.co/functions/v1/order-notify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user?.id || null,
            ...formData,
            pickup_date: pickupDate,
            pickup_time: selectedTime,
            service: subscription ? "subscriber" : formData.service,
            create_invoice: true // Flag for your backend to prep Stripe
          })
        }
      );

      if (!response.ok) throw new Error("Failed to schedule");

      alert("Pickup scheduled! You will be invoiced once the final weight is recorded.");
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[3000] px-2 sm:px-4 bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
        <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-600 text-xl">✕</button>

        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800 text-center">Schedule a Pickup</h2>

        {!subscription && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded text-sm mb-4 text-center">
            You are not a subscriber. <a href="/plans" className="underline text-purple-700 font-semibold ml-1">View plans</a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm text-purple-900">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="text" name="address" placeholder="Pickup Address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required />

          {!subscription && (
            <select name="service" value={formData.service} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
              <option value="">Select Service</option>
              <option value="residential">Residential Wash & Fold</option>
              <option value="commercial">Commercial Laundry</option>
            </select>
          )}

          <select name="bags" value={formData.bags} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select amount of bags (15lbs/bag)</option>
            {[...Array(10)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1} Bag(s) (~{(i+1)*15} lbs)</option>
            ))}
          </select>

          {formData.bags && <p className="text-purple-700 font-semibold">Est. Total: ${formData.estimate}* <span className="text-[10px] font-normal">(Final price based on weight)</span></p>}

          <select name="detergent" value={formData.detergent} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Select Detergent</option>
            <option value="gain">Gain</option>
            <option value="arm-hammer">All Free & Clear</option>
            <option value="tide">Tide</option>
          </select>

          <label className="block text-sm font-medium text-purple-700">Pickup Date</label>
          <div className="flex justify-center bg-purple-50 rounded-lg p-2">
            <DayPicker 
              mode="single" 
              selected={selectedDate} 
              onSelect={setSelectedDate} 
              disabled={{ before: new Date() }} // Allows today
            />
          </div>

          <label className="block text-sm font-medium text-purple-700">Available Times (2hr buffer)</label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const full = isSlotFull(slot.label);
              const past = isSlotPast(slot.hour);
              const isDisabled = full || past;

              return (
                <button
                  type="button"
                  key={slot.label}
                  disabled={isDisabled}
                  onClick={() => setSelectedTime(slot.label)}
                  className={`p-2 rounded border text-xs ${
                    isDisabled ? 'bg-gray-200 text-gray-400 border-gray-200' :
                    selectedTime === slot.label ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border-purple-300'
                  }`}
                >
                  {slot.label}
                  {full && " (Full)"}
                  {past && !full && " (Past)"}
                </button>
              );
            })}
          </div>

          <select name="notificationPreference" value={formData.notificationPreference} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" required>
            <option value="">Notification Preference</option>
            <option value="email">Email</option>
            <option value="text">Text Message</option>
          </select>

          <textarea name="instructions" value={formData.instructions} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" placeholder="Special Instructions" />

          <button
            type="submit"
            disabled={!formComplete || !selectedDate || !selectedTime || loading}
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-bold disabled:opacity-50 transition-all"
          >
            {loading ? "Processing..." : "Confirm & Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
}
