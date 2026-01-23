import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function BookingForm() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('orders').insert({
      name,
      address,
      pickup_time: pickupTime,
      notes,
    })

    if (error) {
      setMessage('Something went wrong. Please try again.')
    } else {
      setMessage('Order received! We’ll reach out shortly.')
      setName('')
      setAddress('')
      setPickupTime('')
      setNotes('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Schedule a Pickup</h2>

      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Address
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>

      <label>
        Pickup Time
        <input
          type="datetime-local"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          required
        />
      </label>

      <label>
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Book Pickup'}
      </button>

      {message && <p>{message}</p>}
    </form>
  )
]
