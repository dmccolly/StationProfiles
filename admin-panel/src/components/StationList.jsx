import React from 'react'

function StationList({ stations, onEdit, onDelete }) {
  return (
    <div className="stations-grid">
      {stations.map((station) => (
        <div key={station.id} className="station-item">
          {station.logo && (
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <img 
                src={station.logo} 
                alt={station.name}
                style={{ maxWidth: '120px', height: 'auto', borderRadius: '8px' }}
              />
            </div>
          )}
          
          <h3>{station.name}</h3>
          <div className="frequency">{station.frequency}</div>
          
          <div className="info">📍 {station.location}</div>
          <div className="info">🎵 {station.format}</div>
          <div className="info">📅 Est. {station.established}</div>
          
          {station.website && (
            <div className="info">
              🌐 <a href={station.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                Website
              </a>
            </div>
          )}
          
          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={() => onEdit(station)}
            >
              ✏️ Edit
            </button>
            <button 
              className="btn btn-danger" 
              onClick={() => {
                console.log('=== DELETE BUTTON CLICKED ===')
                console.log('Station object:', station)
                console.log('Station.id:', station.id)
                console.log('Station keys:', Object.keys(station))
                console.log('Calling onDelete with:', station.id)
                onDelete(station.id)
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StationList