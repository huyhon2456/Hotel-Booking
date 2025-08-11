import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const RecommendedHotels = () => {
    const { rooms, searchedCities, user } = useAppContext();
    const [recommended, setRecommended] = useState([]);

    const filterHotels = () => {
        // Kiểm tra nếu rooms hoặc searchedCities không tồn tại
        if (!rooms || !searchedCities) {
            setRecommended([]);
            return;
        }
        // Thêm một số thành phố mặc định nếu không có thành phố nào được tìm kiếm
        let citiesToCheck = searchedCities;
        if (searchedCities.length === 0) {
            citiesToCheck = ["New York", "Dubai", "Singapore", "London"]; 
        }

        const filteredHotels = rooms
            .slice()
            .filter(room => {
                // Kiểm tra nếu room.hotel hoặc room.hotel.city không tồn tại
                return room.hotel &&
                    room.hotel.city &&
                    citiesToCheck.includes(room.hotel.city);
            });

        setRecommended(filteredHotels);
    };

    useEffect(() => {
        if (rooms && searchedCities) {
            filterHotels();
        }
    }, [rooms, searchedCities]);

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title title='Khách Sạn Được Đề Xuất' subTitle='Những điểm đến mang đến sự thoải mái và tiện nghi làm cho bạn cứ ngỡ mình đang trong chính căn nhà của mình. ' />

            {recommended.length > 0 ? (
                <div className='flex flex-wrap items-start justify-center gap-6 mt-20'>
                    {recommended.slice(0, 4).map((room, index) => (
                        <HotelCard key={room._id} room={room} index={index} />
                    ))}
                </div>
            ) : (
                <div className='mt-10 text-center text-gray-500'>
                    <p>Khám phá các điểm đến mới để nhận đề xuất phù hợp với bạn.</p>
                    <p className='mt-2'>Hãy tìm kiếm để nhận đề xuất.</p>
                </div>
            )}
        </div>
    )
}

export default RecommendedHotels
