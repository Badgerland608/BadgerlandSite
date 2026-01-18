import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function ScheduleModal({ setShowModal }) {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    service: '',
    detergent: '',
  });

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState('');
  const [formComplete, setFormComplete] = useState(false);

  const timeSlots = [
    '5:30 AM - 7:30 AM','8:00 AM - 10:00 AM','10:30 AM - 12:30 PM', '1:00 PM - 3:00 PM', 
    '3:30 PM - 5:30 PM', '6:00 PM - 8:00 PM',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    const isComplete = Object.values(updated).every((val) => val.trim() !== '');
    setFormComplete(isComplete);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pickup scheduled for ${selectedDate?.toLocaleDateString() || 'unspecified date'} at ${selectedTime || 'unspecified time'}!`);
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800 text-center">
          Schedule a Pickup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm text-purple-900">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input type="text" name="address" placeholder="Pickup Address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" required />

          <select name="service" value={formData.service} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" required>
            <option value="">Select Service</option>
            <option value="residential">Residential Wash & Fold</option>
            <option value="commercial">Commercial Laundry</option>
            <option value="pickup-only">Pickup Only</option>
            <option value="dry-cleaning">Dry Cleaning</option>
          </select>

          <select name="detergent" value={formData.detergent} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" required>
            <option value="">Select Detergent</option>
            <option value="gain">Gain</option>
            <option value="arm-hammer">Arm & Hammer</option>
            <option value="tide">Tide</option>
          </select>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="dryerSheets" className="h-4 w-4 text-purple-600" />
            <label htmlFor="dryerSheets" className="text-sm text-purple-700">Include Dryer Sheets</label>
          </div>

          <textarea placeholder="Special Instructions" className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" rows={3} />

          {formComplete && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-purple-700 mb-2">Select a Pickup Date</label>
              <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} />

              {selectedDate && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-purple-700 mb-2">Select a Time Slot</label>
                  <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                    <option value="">Choose a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
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