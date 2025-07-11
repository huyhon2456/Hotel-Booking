import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Hero = () => {
    const { navigate, getToken, axios, setSearchedCities } = useAppContext()
    const [destination, setDestination] = useState("")    
    const onSearch = async (e) => {
        e.preventDefault();
        
        if (destination.trim() === '') {
            toast.error("Vui lòng nhập địa điểm cần tìm kiếm");
            return;
        }
        
        // Đảm bảo URL có query parameter đúng
        navigate(`/rooms?destination=${encodeURIComponent(destination)}`);
        
        try {
            //gọi api để lưu thành phố đã tìm kiếm
            await axios.post('/api/user/recent-search-cities',
                {recentSearchedCity: destination}, 
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );
            
            //add địa điểm vào 3 thành phố gần nhất
            setSearchedCities((prevSearchedCities) => {
                const updatedSearchedCities = [...prevSearchedCities, destination];
                if (updatedSearchedCities.length > 3) {
                    updatedSearchedCities.shift(); // Giữ lại chỉ 3 thành phố gần nhất
                }
                return updatedSearchedCities;
            });
        } catch (error) {
            console.log("Error saving search history:", error);
            // Không hiển thị lỗi cho người dùng vì đây không phải là lỗi quan trọng
        }
    }
    return (
        <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-cover bg-no-repeat bg-center h-screen'>
            <p className='bg-[#FFD2C7]/50 px-3.5 py-1 rounded-full mt-20'>The Ultimate Travelling</p>
            <h1 className='font-playfair text-2xl md:text-6xl md:text-[56px] md:leading-[56px]  max-w-xl mt-4 '>Start your unforgettable journey with us. </h1>
            <p className='max-w-130 mt-2 text-sm md:text-base '>The best travel for your jouney begins now</p>

            <form onSubmit={onSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="destinationInput">Destination</label>
                    </div>
                    <input onChange={(e) => setDestination(e.target.value)} value={destination} list='destinations' id="destinationInput" type="text" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
                    <datalist id='destinations'>
                        {cities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}

                    </datalist>
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkIn">Check in</label>
                    </div>
                    <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkOut">Check out</label>
                    </div>
                    <input id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                    <label htmlFor="guests">Guests</label>
                    <input min={1} max={4} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
                </div>

                <button className='flex items-center justify-center gap-1 rounded-md bg-[var(--color-1)] py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                    <img src={assets.searchIcon} alt="searchIcon" className='h-7' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Hero
