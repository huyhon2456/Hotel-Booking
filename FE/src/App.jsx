import React from 'react'
import Navbar from './components/Navbar'
import { Routes, useLocation, Route } from 'react-router-dom';
import Home from './pages/Home'
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import HotelRegister from './components/HotelRegister';
import Layout from './pages/HotelAdmin/Layout';
import Dashboard from './pages/HotelAdmin/Dashboard';
import AddRoom from './pages/HotelAdmin/AddRoom';
import ListRoom from './pages/HotelAdmin/ListRoom';

const App = () => {
  const isOwerPath = useLocation().pathname.includes( "owner");
  return (
    <div>
    {!isOwerPath && <Navbar/>}
    {false && <HotelRegister/>}
    <div className='min-h-[70vh]'>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/rooms' element={<AllRooms/>} />
        <Route path='/rooms/:id' element={<RoomDetails/>} />
        <Route path='/my-bookings' element={<MyBookings/>} />
        <Route path='/owner' element={<Layout/>} >
          <Route index element={<Dashboard/>}/>
          <Route path='add-room' element={<AddRoom/>}/>
          <Route path='list-room' element={<ListRoom/>}/>
        </Route>
      </Routes>
    </div>
    <Footer/>
    </div>
  )
}

export default App
