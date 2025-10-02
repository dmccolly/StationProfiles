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
      const index = await indexRes.json()
      setStationIndex(index)

      // Load all station data
      const stationPromises = index.map(async (id) => {
        const res = await fetch(`/data/stations/${id}.json`)
        return res.json()
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
      logo: '',
      website: '',
      facebook: '',
      twitter: '',
      instagram: ''
    })
    setIsAddingNew(true)
  }

  const handleSave = (stationData) => {
    // In a real implementation, this would save to a backend
    // For now, we'll just update the local state and show instructions
    
    if (isAddingNew) {
      setStations([...stations, stationData])
      setStationIndex([...stationIndex, stationData.id])
      setMessage({
        type: 'success',
        text: `Station "${stationData.name}" added! Download the JSON below and add it to your repository.`
      })
    } else {
      const updatedStations = stations.map(s => 
        s.id === stationData.id ? stationData : s
      )
      setStations(updatedStations)
      setMessage({
        type: 'success',
        text: `Station "${stationData.name}" updated! Download the JSON below and update your repository.`
      })
    }

    setEditingStation(null)
    setIsAddingNew(false)

    // Trigger download of the JSON file
    downloadStationJSON(stationData)
  }

  const handleDelete = (stationId) => {
    if (confirm('Are you sure you want to delete this station?')) {
      const updatedStations = stations.filter(s => s.id !== stationId)
      const updatedIndex = stationIndex.filter(id => id !== stationId)
      setStations(updatedStations)
      setStationIndex(updatedIndex)
      
      setMessage({
        type: 'success',
        text: 'Station deleted! Remember to remove the file from your repository and update index.json.'
      })

      // Download updated index
      downloadIndexJSON(updatedIndex)
    }
  }

  const handleCancel = () => {
    setEditingStation(null)
    setIsAddingNew(false)
  }

  const downloadStationJSON = (station) => {
    const dataStr = JSON.stringify(station, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${station.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadIndexJSON = (index) => {
    const dataStr = JSON.stringify(index, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'index.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadAllData = () => {
    // Download index
    downloadIndexJSON(stationIndex)
    
    // Download all station files
    stations.forEach(station => {
      setTimeout(() => downloadStationJSON(station), 100)
    })
    
    setMessage({
      type: 'success',
      text: 'All station data downloaded! Upload these files to /public/data/stations/ in your repository.'
    })
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
            <button className="btn btn-secondary" onClick={downloadAllData}>
              💾 Download All Data
            </button>
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