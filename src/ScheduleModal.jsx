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
    '5:30 AM - 7:30 AM','8:00 AM - 10:00 AM','10:30 AM - 12:30 PM',
    '1:00 PM - 3:00 PM','3:30 PM - 5:30 PM','6:00 PM - 8:00 PM',
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

  // ...keep your existing JSX, just wired to formData/handleChange/DayPicker...
}
