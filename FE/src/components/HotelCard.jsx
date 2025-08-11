import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const HotelCard = ({room,index}) => {
  const { formatPrice } = useAppContext()
  return (
  <Link to={'/rooms/' + room._id} onClick={()=>scrollTo(0,0)} key={room._id}
   className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-2 transition duration-300'>
    <img src={room.images[0]} alt="" className='w-full h-44 md:h-52 object-cover block'/>
      { index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full '>Đặt nhiều</p>}
      <div className='p-4 pt-5'>
        <div className='flex items-center justify-between'>
          <p className='font-playfair text-xl font-medium text-gray-800'>{room.hotel.name}</p>
          <div className='flex items-center gap-2'>
            <img src={assets.starIconFilled} alt="star-icon" />4.9
          </div>
        </div>
        <div className='flex items-center gap-2 mt-1 text-sm'>
           <img src={assets.locationIcon} alt="location-icon" />
           <span>{room.hotel.address}</span>        </div>
        <div className='flex items-center justify-between mt-4'>
          <p><span className='text-xl text-gray-800'>{formatPrice(room.pricePerNight)}</span>/đêm</p>
          <button className='px-1 py-2 text-sm border border-gray-300 rounded hover:bg-[var(--color-1)] hover:text-white transition-all cursor-pointer'>ĐẶT NGAY</button>
        </div>
      </div>
    </Link>
  )
}

export default HotelCard
