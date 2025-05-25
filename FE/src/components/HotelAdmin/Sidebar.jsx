import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

    const sibarLinks = [
        { name: 'Dashboard', icon: assets.dashboardIcon, path: '/owner' },
        { name: 'Thêm Phòng', icon: assets.addIcon, path: '/owner/add-room' },
        { name: 'Danh Sách Phòng', icon: assets.listIcon, path: '/owner/list-room' },
    ]
    return (
        <div className='md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transiion-all duration-300'>
            {sibarLinks.map((item, index) => (
                <NavLink to={item.path} key={index} end='/owner' className={({ isActive }) =>
                    `flex items-center py-3 px-4 md:px-8 gap-3 transition-all duration-300 ${isActive
                        ? " bg-[var(--color-1)]/60  text-white"
                        : " text-[var(--color-3)] hover:bg-[var(--color-2)]/60"}`}>
                    <img src={item.icon} alt={item.name} className='min-h-6 min-w-6 invert' />
                    <p className='md:block hidden text-center'>{item.name}</p>
                </NavLink>
            ))}
        </div>
    )
}

export default Sidebar
