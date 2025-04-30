import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: assets.order_icon },
    { name: 'Add Travel', path: '/admin/add-travel', icon:assets.add_icon },
    { name: 'List Travel', path: '/admin/list-travel', icon:assets.list_icon },
  ]
  return (
    <div className='md:w-64 w-16 border-r h-full text-base border-gray-100 pt-4 flex flex-col trasition-all duration-300' style={{ backgroundColor: 'var(--color-primary)' }}>
      {sidebarLinks.map((item, index) => (
        <NavLink 
        to={item.path} 
        key={index} 
        end='/admin'
        className={({isActive})=>
          `flex items-center py-3 px-4 md:px-8 gap-3 transition-all duration-300 font-[Rubik] ${
            isActive 
          ? "border-r-4 md:border-r-[6px] bg-[var(--color-heavy)] border-[var(--color-secondary)] text-[var(--color-secondary)] "
          : " text-white font-[Rubik] hover:bg-[var(--color-four)]"}`}
          >
            <img src={item.icon} alt={item.name} className='min-h-6 min-w-6' />
            <p className='md:block hidden text-center font-[Rubik]'>{item.name}</p>

        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
