import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Dashboard from './pages/Dashboard'
import Edit from './pages/Edit'
import { TravelProvider } from './context/TravelContext'

const App = () => {
  return (
    <TravelProvider>
      <div className='flex flex-col h-screen'>
        <Navbar/>
        <div className='flex h-full'>
          <hr/>
          <Sidebar/>
          <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
            <Routes>
              <Route path='/admin' element={<Dashboard/>}/>
              <Route path='/admin/add' element={<Add/>}/>
              <Route path='/admin/list' element={<List/>}/>
              <Route path='/admin/edit/:id' element={<Edit/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </TravelProvider>
  )
}

export default App
