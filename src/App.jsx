import { useState } from 'react';
import Header from './Header';

import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Rates from './Rates';

import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BookingForm from './components/BookingForm';

function App() {
  const [step, setStep] = useState('calendar');
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);

  return (
    <>
      <Header />

      {/* STEP 1 — PICK A DATE */}
      {step === 'calendar' && (
        <Calendar
          onSelectDate={(selectedDate) => {
            setDate(selectedDate);
            setStep('timeslots');
          }}
        />
      )}

      {/* STEP 2 — PICK A TIME WINDOW */}
      {step === 'timeslots' && (
        <TimeSlots
          date={date}
          onSelectSlot={(selectedSlot) => {
            setSlot(selectedSlot);
            setStep('form');
          }}
        />
      )}

      {/* STEP 3 — ENTER ORDER INFO */}
      {step === 'form' && (
        <BookingForm
          date={date}
          slot={slot}
          onBack={() => setStep('timeslots')}
        />
      )}

      {/* Your existing marketing sections */}
      <Hero />
      <HowItWorks />
      <Rates />

      <div className="bg-slate-900">
        <h2>Badgerland Laundry</h2>
      </div>
    </>
  );
}

export default App;
