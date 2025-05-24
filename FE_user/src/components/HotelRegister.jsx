import React from 'react'
import { assets, cities } from '../assets/assets'

const HotelRegister = () => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-[var(--color-2)]/70 '>
        <form className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
            <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-xl hidden md:block' />

            <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                <img src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer' />
                <p className='text-2xl font-semibold mt-6 text-[var(--color-3)]'>Đăng kí khách sạn của bạn</p>

                {/*tên khách sạn */}
                <div className='w-full mt-4'>
                    <label htmlFor="name" className='font-medium text-[var(--color-3)]'>
                        Tên khách sạn
                    </label>
                    <input id='name' type="text" placeholder='VD: Luxury Hotel' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-[var(--color-1)] font-light required' />
                </div>
                {/*Liên hệ */}
                <div className='w-full mt-4'>
                    <label htmlFor="contact" className='font-medium text-[var(--color-3)]'>
                        Số điện thoại
                    </label>
                    <input id='contact' type="text" placeholder='...' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-[var(--color-1)] font-light required' />
                </div>
                {/*Địa chỉ */}
                <div className='w-full mt-4'>
                    <label htmlFor="address" className='font-medium text-[var(--color-3)]'>
                        Địa chỉ
                    </label>
                    <input id='address' type="text" placeholder='...' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-[var(--color-1)] font-light required' />
                </div>
                {/*Thành phố */}
                <div className='w-full mt-4 max-w-60 mr-auto'>
                    <label htmlFor="city" className='font-medium text-[var(--color-3)]'>Thành phố</label>
                    <select id="city" className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-[var(--color-1)]font-light required'>
                        <option value="">Chọn Thành phố</option>
                        {cities.map((city)=>(
                            <option value={city} key={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <button className='bg-[var(--color-1)] hover:bg-[var(--color-2)] trasition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6 hover:text-[var(--color-4)]'>Đăng kí ngay</button>
            </div>

        </form>
      
    </div>
  )
}

export default HotelRegister
