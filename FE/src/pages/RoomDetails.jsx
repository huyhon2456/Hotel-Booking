import React, { use } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import StartRating from '../components/StartRating'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const RoomDetails = () => {
    const { id } = useParams();
    const { rooms, getToken, axios, navigate, formatPrice } = useAppContext(); const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);

    const [checkInDate, setCheckInDate] = useState("")
    const [checkOutDate, setCheckOutDate] = useState("")
    const [guest, setGuest] = useState(1)

    const [isAvailable, setIsAvailable] = useState(false)
    const [isChecked, setIsChecked] = useState(false) 
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

    // Kiểm tra tính khả dụng của phòng
    const checkAvailability = async () => {
        try {
            // Kiểm tra ngày vào luôn nhỏ hơn ngày ra
            if (!checkInDate || !checkOutDate) {
                toast.error('Vui lòng chọn ngày check-in và check-out');
                return false;
            }

            if (new Date(checkInDate) >= new Date(checkOutDate)) {
                toast.error('Ngày vào phải trước ngày ra');
                setIsAvailable(false);
                setIsChecked(false);
                return false;
            }

            setIsCheckingAvailability(true);
            const { data } = await axios.post('/api/bookings/check-availability', {
                room: id,
                checkInDate,
                checkOutDate
            });

            if (data.success) {
                setIsAvailable(data.isAvailable);
                setIsChecked(true);
                if (data.isAvailable) {
                    toast.success('Phòng có sẵn! Bạn có thể đặt phòng ngay.');
                    return true;
                } else {
                    toast.error('Phòng không còn sẵn trong thời gian này');
                    return false;
                }
            } else {
                toast.error(data.message || 'Lỗi kiểm tra tính khả dụng');
                setIsChecked(false);
                return false;
            }
        } catch (error) {
            toast.error(error.message || 'Đã xảy ra lỗi khi kiểm tra');
            setIsAvailable(false);
            setIsChecked(false);
            return false;
        } finally {
            setIsCheckingAvailability(false);
        }
    }    // Xử lý sự kiện khi người dùng nhấn nút đặt phòng
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            // Nếu chưa kiểm tra tính khả dụng, thực hiện kiểm tra trước
            if (!isChecked) {
                await checkAvailability();
                return;
            }

            // Nếu đã kiểm tra nhưng phòng không có sẵn
            if (isChecked && !isAvailable) {
                toast.error('Phòng không còn trống. Vui lòng chọn ngày khác.');
                return;
            }

            // Đặt phòng khi đã kiểm tra và phòng có sẵn
            const token = await getToken();
            if (!token) {
                toast.error('Vui lòng đăng nhập để đặt phòng');
                navigate('/login');
                return;
            }

            const { data } = await axios.post(
                '/api/bookings/book',
                {
                    room: id,
                    checkInDate,
                    checkOutDate,
                    guest: parseInt(guest),
                    paymentMethod: "Trả Tiền Mặt"
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (data.success) {
                toast.success('Đặt phòng thành công');
                navigate('/my-bookings');
                scrollTo(0, 0);
            } else {
                toast.error(data.message || 'Lỗi đặt phòng');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi đặt phòng');
        }
    }

    useEffect(() => {
        const room = rooms.find(room => room._id === id);
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    }, [rooms]);
    useEffect(() => {
        if (checkInDate && checkOutDate) {
            setIsChecked(false);
            setIsAvailable(false);
        } else {
            setIsAvailable(false);
            setIsChecked(false);
        }
    }, [checkInDate, checkOutDate]);
    return room && (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/*chi tiết phòng (header) */}
            <div className='flex flex-col md:flex-row items-start gap-2 md:items-center'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name}<span className='font-inter text-sm'>({room.roomType})</span></h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-[var(--color-3)] rounded-full'>Giảm 20%</p>
            </div>
            {/*đánh giá */}
            <div className='flex items-center gap-1 mt-2'>
                <StartRating />
                <p className='ml-2'>100+ reviews</p>
            </div>
            {/*địa chỉ phòng */}
            <div className='flex items-center gap-1 mt-2 text-gray-500'>
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
            </div>
            {/*hình ảnh phòng */}
            <div className='flex flex-col lg:flex-row items-start gap-6 mt-6'>
                <div className='lg:w-1/2 w-full'>
                    <img src={mainImage} alt="Room Image" className='w-full rounded-xl shadow-lg object-cover' />
                </div>
                <div className='grid grid-cols-2 lg:w-1/2 w-full gap-4 '>
                    {room?.images.length > 1 && room.images.map((image, index) => (
                        <img onClick={() => setMainImage(image)} key={index} src={image} alt='Room Image' className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && 'outline-3 outline-[var(--color-1)]/50'}`} />
                    ))}
                </div>
            </div>
            {/*thông tin phòng */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Với cơ sở tiện nghi và hiện đại nhất</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-2)]/50'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>

                            </div>
                        ))}
                    </div>
                </div>
                {/*giá phòng */}
                <p className='text-2xl font-medium'>{formatPrice(room.pricePerNight)}/đêm</p>
            </div>
            {/*check in/out  */}
            <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] rounded-xl p-6 mt-16 mx-auto max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Ngày Vào</label>
                        <input
                            onChange={(e) => setCheckInDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            type="date"
                            id='checkInDate'
                            placeholder='Check-In'
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-[var(--color-1)]'
                            required
                        />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium'>Ngày Ra</label>
                        <input
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            min={checkInDate || new Date().toISOString().split("T")[0]}
                            disabled={!checkInDate}
                            type="date"
                            id='checkOutDate'
                            placeholder='Check-Out'
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-[var(--color-1)] disabled:bg-gray-100 disabled:cursor-not-allowed'
                            required
                        />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="Guest" className='font-medium'>Số Người</label>
                        <input
                            onChange={(e) => setGuest(Math.max(1, parseInt(e.target.value) || 1))}
                            value={guest}
                            min="1"
                            max={room.capacity || 10}
                            type="number"
                            id='Guest'
                            placeholder='1'
                            className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-[var(--color-1)]'
                            required
                        />
                    </div>
                </div>
                <button
                    type='submit'
                    disabled={isCheckingAvailability}
                    className={`
                        ${isChecked && isAvailable
                            ? 'bg-[var(--color-1)] hover:bg-[var(--color-2)]/50 hover:text-gray-700 active:scale-95'
                            : isChecked && !isAvailable
                                ? 'bg-red-500 cursor-not-allowed'
                                : 'bg-[var(--color-1)] hover:bg-[var(--color-2)]/50 hover:text-gray-700 active:scale-95'
                        } 
                        transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base
                        ${isCheckingAvailability ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {isCheckingAvailability
                        ? 'Đang kiểm tra...'
                        : isChecked && isAvailable
                            ? 'Đặt ngay'
                            : isChecked && !isAvailable
                                ? 'Không còn phòng'
                                : 'Kiểm tra tính khả dụng'
                    }
                </button>
            </form>
            {/*thông tin thêm */}
            <div className='mt-25 space-y-4'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>khách hàng sẽ cảm thấy thoải mái và dễ chịu</p>
            </div>
            {/*Chủ ks */}
            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4'>
                    <img src={assets.userIcon} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full invert opacity-80' />
                    <div>
                        <p className='text-lg md:text-xl'>Chủ Khách Sạn: {room.hotel.name}</p>
                        <div className='flex items-center mt-1'>
                            <StartRating />
                            <p className='ml-2'>100+ reviews</p>
                        </div>
                    </div>
                </div>
                <button className='px-6 py-2.5 mt-4 rounded text-white bg-[var(--color-1)] hover:bg-[var(--color-2)]/50 transition-all cursor-pointer hover:text-gray-700'>Liên hệ ngay</button>

            </div>
        </div>
    )
}

export default RoomDetails
