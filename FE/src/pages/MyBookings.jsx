import React from 'react'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/assets'
import { useState } from 'react'

const MyBookings = () => {

    const [bookings, setBookings] = useState(userBookingsDummyData)

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title='Bookings của tôi' subTitle='Thông tin nhận phòng, ngày tháng và nhiều hơn nữa' align='left' />

            <div className='max-w-6xl mt-8 w-full text-gray-800'>
                <div className='hidden md:grid md:grid-cols-[4fr_3fr_2fr] w-full border-b border-gray-300 py-3 font-medium text-base'>
                    <div className='w-1/3'>Khách Sạn</div>
                    <div className='w-1/3'>Ngày & Thời Gian</div>
                    <div className='w-1/3'>Thanh Toán</div>
                </div>

                {bookings.map((booking) => (
                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[4fr_3fr_2fr] w-full border-b border-gray-300 py-6 first:border-t'>
                        {/*chi tiết phòng */}
                        <div className='flex flex-col md:flex-row'>
                            <img src={booking.room.images[0]} alt="hotel-img" className='min-md:w-44 rounded shadow object-cover' />
                            <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                                <p className='font-playfair text-2xl'>{booking.hotel.name}
                                    <span className='font-inter text-sm'> ({booking.room.roomType})</span>
                                </p>
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.locationIcon} alt="location-icon" />
                                    <span>{booking.hotel.address}</span>
                                </div>
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.guestsIcon} alt="guests-icon" />
                                    <span>Số lượng: {booking.guests}</span>
                                </div>
                                <p className='text-base'>Tổng: {booking.totalPrice}.000 VND</p>
                            </div>
                        </div>
                        {/*ngày và tg */}
                        <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                            <div>
                                <p>Ngày vào:</p>
                                <p className='text-gray-500 text-sm'>
                                    {new Date(booking.checkInDate).toDateString()}
                                </p>
                            </div>

                            <div>
                                <p>Ngày ra:</p>
                                <p className='text-gray-500 text-sm'>
                                    {new Date(booking.checkOutDate).toDateString()}
                                </p>
                            </div>
                        </div>
                        {/* trạng thái thanh toán */}
                        <div className='flex flex-col items-start justify-center pt-3'>
                            <div className='flex items-center gap-2'>
                                <div className={`h-3 w-3 rounded-full ${booking.isPaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <p className={`text-sm ${booking.isPaid ? 'text-green-500' : 'text-red-500'}`}>
                                    {booking.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </p>
                            </div>
                            {!booking.isPaid && (
                                <button className='px-4 py-1.5 mt-4 text-xs bg-[var(--color-1)] text-white rounded-full hover:bg-[var(--color-2)]/50 transition-all hover:text-gray-700 cursor-pointer'>
                                    thanh toán
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings
