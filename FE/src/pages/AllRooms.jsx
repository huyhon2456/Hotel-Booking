import React, { useMemo, useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StartRating from '../components/StartRating'
import { useAppContext } from '../context/AppContext'

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex items-center gap-3 cursor-pointer mt-2 text-sm'>
            <input type='checkbox' checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex items-center gap-3 cursor-pointer mt-2 text-sm'>
            <input type='radio' name='sortOption' checked={selected} onChange={() => onChange(label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const AllRooms = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { rooms, navigate, currency, formatPrice } = useAppContext()
    const [openFilters, setOpenFilters] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState({
        roomType: [],
        priceRange: [],
    })
    const [selectedSort, setSelectedSort] = useState('')
    const roomTypes = [
        "Phòng đơn",
        "Phòng đôi",
        "Phòng gia đình",
        "Phòng Vip"
    ]

    const priceRanges = [
        "Dưới 1 triệu",
        "1 triệu - 2 triệu",
        "2 triệu - 3 triệu",
        "Trên 3 triệu"
    ]

    const sortOptions = [
        "Giá thấp đến cao",
        "Giá cao đến thấp",
        "Mới nhất",
    ]

    const handleFilterChange = (check, value, type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters }
            if (check) {
                updatedFilters[type].push(value)
            } else {
                updatedFilters[type] = updatedFilters[type].filter(item => item !== value)
            }
            return updatedFilters;
        })
    }
    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption);
    }
    // hàm kiểm tra nếu loại phòng đã được chọn trùng khớp
    const matchesRoomType = (room) => {
        return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType);
    }    // hàm kiểm tra nếu giá phòng nằm trong khoảng đã chọn
    const matchesPriceRange = (room) => {
        if (selectedFilters.priceRange.length === 0) return true;
        
        return selectedFilters.priceRange.some(range => {
            // Ensure price is a number
            const price = typeof room.pricePerNight === 'string' ? 
                parseFloat(room.pricePerNight) : room.pricePerNight;
            
            if (range === "Dưới 1 triệu" || range.includes("Dưới 1 triệu")) {
                return price < 1000000;
            } else if (range === "1 triệu - 2 triệu" || range.includes("1 triệu - 2 triệu")) {
                return price >= 1000000 && price <= 2000000;
            } else if (range === "2 triệu - 3 triệu" || range.includes("2 triệu - 3 triệu")) {
                return price >= 2000000 && price <= 3000000;
            } else if (range === "Trên 3 triệu" || range.includes("Trên 3 triệu")) {
                return price > 3000000;
            }
            return false;
        });
    }    // hàm lọc các phòng theo loại phòng và khoảng giá
    const sortRooms = (a, b) => {
        // Ensure prices are numbers
        const priceA = typeof a.pricePerNight === 'string' ? 
            parseFloat(a.pricePerNight) : a.pricePerNight;
        const priceB = typeof b.pricePerNight === 'string' ? 
            parseFloat(b.pricePerNight) : b.pricePerNight;
            
        if (selectedSort === "Giá thấp đến cao") {
            return priceA - priceB;
        } else if (selectedSort === "Giá cao đến thấp") {
            return priceB - priceA;
        } else if (selectedSort === "Mới nhất") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    }    //lọc vị trí
    const filterDestination = (room) => {
        const destination = searchParams.get('destination');
        if (!destination) return true; // nếu không có vị trí tìm kiếm thì trả về tất cả
        
        // Kiểm tra xem room.hotel và room.hotel.city có tồn tại không
        if (!room.hotel || !room.hotel.city) {
            return false;
        }
        
        return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
    }

    // lọc các phòng theo loại phòng, khoảng giá và vị trí
    const filteredRooms = useMemo(() => {
        return rooms.filter(room =>
            matchesRoomType(room) &&
            matchesPriceRange(room) &&
            filterDestination(room)
        ).sort(sortRooms);
    }, [rooms, selectedFilters, selectedSort, searchParams]);

    //xóa hết lọc
    const clearFilters = () => {
        setSelectedFilters({
            roomType: [],
            priceRange: [],
        });
        setSelectedSort('');
        setSearchParams({});
    }


    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 '>
            <div>
                <div className='flex flex-col items-start text-left'>
                    <h1 className=' font-playfair text-4xl md:text-[40px]'>Tất cả phòng</h1>
                    <p className=' text-sm md:text-base text-gray-500/90 mt-2 max-w-174'> Mỗi phòng đều mang lại một vẻ đẹp và sự tiện nghi riêng</p>
                </div>
                {filteredRooms.map((room) => (
                    <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                        <img onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }} src={room.images[0]} alt="hotel-img" title='Chi tiết phòng' className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />
                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <p className='text-gray-500'>{room.hotel.city}</p>
                            <p onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }} className='text-gray-800 text-3xl font-playfair cursor-pointer'>{room.hotel.name}</p>
                            <div className='flex items-center'>
                                <StartRating />
                                <p className='ml-2'>100+ reviews</p>
                            </div>
                            <div className='flex items-center gap-1 text-gray-500 text-sm mt-2'>
                                <img src={assets.locationIcon} alt="loaction-icon" />
                                <span>{room.hotel.address}</span>
                            </div>
                            {/*tiện nghi của các phòng */}
                            <div className='grid grid-cols-3 gap-4 mt-3 mb-6'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-2)]/50'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Giá phòng */}
                            <p className='text-xl font-medium text-gray-700'>{formatPrice(room.pricePerNight)}/đêm</p>
                        </div>
                    </div>
                ))}

            </div>
            {/*Filter */}
            <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
                <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && 'border-b'}`}>

                    <p className='text-base font-medium text-gray-800'>Bộ Lọc</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                            {openFilters ? 'Thu Gọn' : 'Hiển Thị'}</span>
                        <span onClick={clearFilters} className='hidden lg:block'>Xóa</span>
                    </div>
                </div>
                <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2 border-l-4 border-[var(--color-1)] pl-2 pt-2 bg-[var(--color-2)]/30'> Lọc theo phòng</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox key={index} label={room} selected={selectedFilters.roomType.includes(room)} onChange={(checked) => handleFilterChange(checked, room, 'roomType')} />
                        ))}
                    </div>
                    <div className='px-5 pt-5'>                        <p className='font-medium text-gray-800 pb-2 border-l-4 border-[var(--color-1)] pl-2 pt-2 bg-[var(--color-2)]/30'> Lọc theo giá</p>
                        {priceRanges.map((range, index) => (
                            <CheckBox key={index} label={`${range} ${currency}`} selected={selectedFilters.priceRange.includes(range)} onChange={(checked) => handleFilterChange(checked, range, 'priceRange')} />
                        ))}
                    </div>
                    <div className='px-5 pt-5 pb-7'>
                        <p className='font-medium text-gray-800 pb-2 border-l-4 border-[var(--color-1)] pl-2 pt-2 bg-[var(--color-2)]/30'> Lọc theo thứ tự</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton key={index} label={option} selected={selectedSort === option} onChange={() => handleSortChange(option)} />
                        ))}
                    </div>

                </div>

            </div>
        </div>

    )
}

export default AllRooms
