import React, { useState, useEffect } from 'react'
import StationList from './components/StationList'
import StationEditor from './components/StationEditor'

function App() {
  const [stations, setStations] = useState([])
  const [stationIndex, setStationIndex] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingStation, setEditingStation] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    loadStations()
  }, [])

  const loadStations = async () => {
    try {
      setLoading(true)
      // Load the index
      const indexRes = await fetch('/data/stations/index.json')
      const indexData = await indexRes.json()
      const stationIds = indexData.stations || []
      setStationIndex(stationIds)

      // Load all station data
      const stationPromises = stationIds.map(async (id) => {
        const res = await fetch(`/data/stations/${id}.json`)
        const stationData = await res.json()
        // Map stationName to name for consistency
        return {
          ...stationData,
          name: stationData.stationName || stationData.name || ''
        }
      })

      const stationsData = await Promise.all(stationPromises)
      setStations(stationsData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading stations:', error)
      setMessage({ type: 'error', text: 'Failed to load stations' })
      setLoading(false)
    }
  }

  const handleEdit = (station) => {
    setEditingStation(station)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setEditingStation({
      id: '',
      name: '',
      frequency: '',
      location: '',
      format: '',
      established: '',
      synopsis: '',
      fullProfile: '',
      fullContent: '',
      logo: '',
      website: '',
      facebook: '',
      twitter: '',
      instagram: ''
    })
    setIsAddingNew(true)
  }

  const handleSave = async (stationData) => {
    try {
      setLoading(true)
      
      // Prepare data for backend - ensure stationName is set
      const backendData = {
        ...stationData,
        stationName: stationData.name || stationData.stationName
      }

      const action = isAddingNew ? 'create' : 'update'
      
      const response = await fetch('/.netlify/functions/update-station', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action,
          stationId: stationData.id,
          stationData: backendData
        })
      })

      const result = await response.json()

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Station "${stationData.name}" ${action}d successfully!`
        })
        
        // Reload stations to get updated data
        await loadStations()
        
        setEditingStation(null)
        setIsAddingNew(false)
      } else {
        throw new Error(result.error || 'Failed to save station')
      }
    } catch (error) {
      console.error('Error saving station:', error)
      setMessage({
        type: 'error',
        text: `Failed to save station: ${error.message}`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (stationId) => {
    const stationToDelete = stations.find(s => s.id === stationId)
    const stationName = stationToDelete ? stationToDelete.name : stationId

    if (confirm(`Are you sure you want to delete "${stationName}"? This action cannot be undone.`)) {
      try {
        setLoading(true)
        
        const response = await fetch('/.netlify/functions/update-station', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'delete',
            stationId: stationId
          })
        })

        const result = await response.json()

        if (result.success) {
          setMessage({
            type: 'success',
            text: `Station "${stationName}" deleted successfully!`
          })
          
          // Reload stations to get updated data
          await loadStations()
        } else {
          throw new Error(result.error || 'Failed to delete station')
        }
      } catch (error) {
        console.error('Error deleting station:', error)
        setMessage({
          type: 'error',
          text: `Failed to delete station: ${error.message}`
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setEditingStation(null)
    setIsAddingNew(false)
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading stations...</div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📻 Station Admin Panel</h1>
        <p>Manage your Idaho radio station profiles</p>
      </div>

      {message && (
        <div className={message.type === 'error' ? 'error' : 'success'}>
          {message.text}
          <button 
            onClick={() => setMessage(null)}
            style={{ float: 'right', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ×
          </button>
        </div>
      )}

      <div className="stations-list">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#1a1a1a' }}>Stations ({stations.length})</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary add-station-btn" onClick={handleAddNew}>
              ➕ Add New Station
            </button>
          </div>
        </div>

        <StationList 
          stations={stations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {editingStation && (
        <StationEditor
          station={editingStation}
          isNew={isAddingNew}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default App