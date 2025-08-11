import React, { use } from 'react'
import { useAppContext } from '../context/AppContext'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext()

  return rooms.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title title='Điểm Đến Nổi Bật' subTitle='Những điểm đến mang đến sự thoải mái và tiện nghi làm cho bạn cứ ngỡ mình đang trong chính căn nhà của mình. ' />
  <div className='flex flex-wrap items-start justify-center gap-6 mt-20'>
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='my-16 px-4 py-2 text-sm font-medium border border-gray-200 rounded bg-white hover:bg-[var(--color-1)] hover:text-white transition-all cursor-pointer '>
        Xem tất cả điểm đến
      </button>
    </div>
  )
}

export default FeaturedDestination
