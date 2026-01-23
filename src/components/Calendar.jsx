export default function Calendar({ onSelectDate }) {
  const today = new Date()
  const days = [...Array(14)].map((_, i) => {
    const d = new Date()
    d.setDate(today.getDate() + i)
    return d
  })

  return (
    <div style={{ padding: 20 }}>
      <h2>Select a Pickup Date</h2>

      {days.map((d) => {
        const iso = d.toISOString().split('T')[0]
        return (
          <button
            key={iso}
            onClick={() => onSelectDate(iso)}
            style={{
              display: 'block',
              margin: '10px 0',
              padding: '10px',
              width: '100%',
            }}
          >
            {d.toDateString()}
          </button>
        )
      })}
    </div>
  )
}
