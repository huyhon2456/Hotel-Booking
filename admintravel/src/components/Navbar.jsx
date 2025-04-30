import React from 'react'
import { assets } from '../assets/assets' 
import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
        <div className='flex items-center justify-between px-4 md:px-8 border-b border-0 py-3 transition-all duration-300' style={{ backgroundColor: 'var(--color-primary)' }}>
      <Link to='/'>
            <img className='h-15 invert opacity-90' src={assets.logo} alt="" />
      </Link>
            <button className= 'text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-[Rubik]' style={{backgroundColor:'var(--color-secondary)'}}>Logout</button>
        
        </div>
   
  )
}
export default Navbar
