import React, { useState } from 'react'

function StationEditor({ station, isNew, onSave, onCancel }) {
  const [formData, setFormData] = useState(station)
  const [imagePreview, setImagePreview] = useState(station.logo || '')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData(prev => ({
          ...prev,
          logo: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setFormData(prev => ({
      ...prev,
      logo: url
    }))
    setImagePreview(url)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.id || !formData.name || !formData.frequency) {
      alert('Please fill in all required fields (ID, Name, Frequency)')
      return
    }

    onSave(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isNew ? '➕ Add New Station' : '✏️ Edit Station'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Station ID *</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g., krvb"
                required
                disabled={!isNew}
              />
              <small>Lowercase, no spaces. Used for filename (e.g., krvb.json)</small>
            </div>

            <div className="form-group">
              <label>Station Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder='e.g., KRVB "The River"'
                required
              />
            </div>

            <div className="form-group">
              <label>Frequency *</label>
              <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="e.g., 94.9 FM"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Nampa/Boise, Idaho"
              />
            </div>

            <div className="form-group">
              <label>Format</label>
              <input
                type="text"
                name="format"
                value={formData.format}
                onChange={handleChange}
                placeholder="e.g., Adult Album Alternative (AAA)"
              />
            </div>

            <div className="form-group">
              <label>Year Established</label>
              <input
                type="text"
                name="established"
                value={formData.established}
                onChange={handleChange}
                placeholder="e.g., 1975"
              />
            </div>

            <div className="form-group">
              <label>Logo/Image</label>
              <div className="image-upload" onClick={() => document.getElementById('imageFile').click()}>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p>📷 Click to upload image or enter URL below</p>
              </div>
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleImageUrlChange}
                placeholder="Or paste image URL here"
                style={{ marginTop: '0.5rem' }}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Website URL</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="form-group">
              <label>Twitter/X URL</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
              />
            </div>

            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="form-group">
              <label>Synopsis (Short Description)</label>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                placeholder="Brief description for the card view..."
              />
            </div>

            <div className="form-group">
              <label>Full Profile (Detailed Description)</label>
              <textarea
                name="fullProfile"
                value={formData.fullProfile}
                onChange={handleChange}
                placeholder="Detailed station history and information..."
                style={{ minHeight: '200px' }}
              />
            </div>

            <div className="form-group">
              <label>Full Content (Complete Station History)</label>
              <textarea
                name="fullContent"
                value={formData.fullContent}
                onChange={handleChange}
                placeholder="Complete detailed station history from PDFs..."
                style={{ minHeight: '400px' }}
              />
              <small>This is the long-form content that appears in the modal when users click "Read Complete Station Profile"</small>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                💾 Save Station
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StationEditor