import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useTravel } from '../context/TravelContext'

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { travels, updateTravel } = useTravel()
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    price: '',
    duration: '',
    description: '',
    images: []
  })
  const [previewImages, setPreviewImages] = useState([])

  useEffect(() => {
    const travel = travels.find(t => t.id === parseInt(id))
    if (travel) {
      setFormData(travel)
      if (travel.images && travel.images.length > 0) {
        setPreviewImages(travel.images)
      }
    }
  }, [id, travels])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateTravel(parseInt(id), formData)
    navigate('/admin/list')
  }

  return (
    <div className="p-6">
      <Title 
        title="Edit Travel Package" 
        subTitle="Modify travel package details"
        align="left"
      />

      <form onSubmit={handleSubmit} className="mt-8 max-w-4xl">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 text-[var(--color-secondary)]">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--color-secondary)]">Package Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--color-secondary)]">Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--color-secondary)]">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--color-secondary)]">Duration (Days)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 text-[var(--color-secondary)]">Images</h3>
            <div 
              className="border-2 border-dashed border-[var(--color-secondary)] rounded-lg p-6 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files)
                if (files.some(file => !file.type.startsWith('image/'))) {
                  alert('Please upload only image files')
                  return
                }
                handleImageUpload({ target: { files } })
              }}
            >
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <img src={assets.upload_area} alt="Upload" className="mx-auto h-12 mb-4" />
                <p className="text-sm text-[var(--color-secondary)]">Click to upload or drag images here</p>
                <p className="text-xs text-[var(--color-secondary)] mt-1">PNG, JPG up to 10MB each</p>
              </label>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 text-[var(--color-secondary)]">Description</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/list')}
              className="px-6 py-2 rounded-md text-[var(--color-secondary)] bg-[var(--color-heavy)] hover:bg-opacity-80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-four)] transition-colors"
            >
              Update Package
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Edit