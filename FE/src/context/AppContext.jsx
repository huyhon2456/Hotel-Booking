import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext()

export const AppProvider = ({ children }) => {


    const currency = import.meta.env.VITE_CURRENCY || 'VND';
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    // Hàm định dạng giá tiền 
    const formatPrice = (price) => {
        // Chuyển đổi thành số nếu cần
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        // Định dạng số với dấu phân cách hàng nghìn và 0 chữ số thập phân
        return numPrice.toLocaleString('vi-VN') + ' ' + currency;
    };

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms')
            if (data.success) {
                if (data.rooms && data.rooms.length > 0) {
                    // Lưu trữ danh sách phòng vào state
                    setRooms(data.rooms);
                } else {
                    console.log("No rooms found in response");
                    setRooms([]);
                }
            } else {
                toast.error('Failed to fetch rooms');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while fetching rooms');
        }
    }

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                // Kiểm tra nếu recentSearchedCities tồn tại và là mảng
                if (Array.isArray(data.recentSearchedCities)) {
                    setSearchedCities(data.recentSearchedCities);
                } else {
                    console.warn("Warning: recentSearchedCities is not an array");
                    setSearchedCities([]);
                }
            } else {
                //fetch user sau 5 giay
                setTimeout(() => {
                    fetchUser();
                }, 5000);
            }
        } catch (error) {
            toast.error('Failed to fetch user data');
        }
    }

    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user])

    useEffect(() => {
        fetchRooms();
    }, [])

    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        axios,
        showHotelReg,
        setShowHotelReg,
        searchedCities,
        setSearchedCities,
        formatPrice,
        rooms,
        fetchRooms
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext = () => useContext(AppContext);
