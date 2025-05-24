import React, { createContext, useState, useContext } from 'react'

const TravelContext = createContext()

export const TravelProvider = ({ children }) => {
  const [travels, setTravels] = useState([
    {
      id: 1,
      name: 'Paris Adventure',
      destination: 'Paris, France',
      price: 1200,
      duration: 7,
      description: 'Explore the city of love',
      images: ['image1.jpg']
    },
    {
      id: 2,
      name: 'Tokyo Explorer',
      destination: 'Tokyo, Japan',
      price: 1800,
      duration: 10,
      description: 'Experience Japanese culture',
      images: ['image2.jpg']
    }
  ])

  const addTravel = (newTravel) => {
    setTravels(prev => [...prev, { ...newTravel, id: prev.length + 1 }])
  }

  const deleteTravel = (id) => {
    setTravels(prev => prev.filter(travel => travel.id !== id))
  }

  const updateTravel = (id, updatedTravel) => {
    setTravels(prev => prev.map(travel => 
      travel.id === id ? { ...travel, ...updatedTravel } : travel
    ))
  }

  return (
    <TravelContext.Provider value={{ travels, addTravel, deleteTravel, updateTravel }}>
      {children}
    </TravelContext.Provider>
  )
}

export const useTravel = () => {
  const context = useContext(TravelContext)
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider')
  }
  return context
}