import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

//hàm kiểm tra xem phòng có hợp lệ hay k
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        const isAvailable = bookings.length === 0; // Trả về true nếu không có booking nào trùng
        return isAvailable;

    } catch (error) {
        console.error("Error checking room availability:", error);
        return false;
    }
}

//api để ktra tính hợp lệ của phòng
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        return res.json({ success: true, isAvailable });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//api để tạo booking
//post /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room, guest, paymentMethod } = req.body;
        const user = req.user._id; // Lấy user từ token đã xác thực

        console.log("Booking request:", { checkInDate, checkOutDate, room, guest, paymentMethod, user });

        //trc khi ktra tính hợp lệ
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });
        if (!isAvailable) {
            return res.json({ success: false, message: "Phòng không còn khả dụng trong khoảng thời gian này." });
        }
        //tính tổng tiền
        const roomData = await Room.findById(room).populate('hotel');
        if (!roomData) {
            return res.json({ success: false, message: "Phòng không tồn tại." });
        }
        
        let totalPrice = roomData.pricePerNight
        //tính tổng tiền dựa trên số đêm
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Chia cho số mili giây trong một ngày
        totalPrice *= nights; // Tổng tiền = giá mỗi đêm * số đêm
        
        // Tạo booking
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guest || 1,
            checkInDate,
            checkOutDate,
            totalPrice,
            paymentMethod: paymentMethod || "Pay At Hotel",
        });
        
        console.log("Booking created:", booking);
        res.json({ success: true, message: "Đặt phòng thành công", booking });
    } catch (error) {
        console.log("Booking error:", error)
        res.json({ success: false, message: "Booking failed: " + error.message });
    }
};
//api để lấy tất cả booking của user
//get /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id; // Lấy user từ token đã xác thực
        const bookings = await Booking.find({ user })
            .populate('room hotel')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getHotelBookings = async (req, res) => {
   try {
     console.log('getHotelBookings called with user:', req.user ? req.user._id : 'No user');
     
     // Sử dụng req.user._id thay vì req.auth.userId
     const hotel = await Hotel.findOne({ owner: req.user._id });
     
     console.log('Found hotel:', hotel ? hotel._id : 'No hotel found');
     
     if (!hotel) {
        return res.json({ 
            success: false, 
            message: "Không tìm thấy khách sạn cho tài khoản này"
        });
     }
     
     // Tìm tất cả booking cho khách sạn này
     const bookings = await Booking.find({ hotel: hotel._id })
        .populate('room hotel user')
        .sort({ createdAt: -1 });
        
     console.log('Found bookings:', bookings.length);
     
     // Tổng lượt booking
     const totalBookings = bookings.length;
     
     // Tổng tiền
     const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
     
     console.log('Dashboard data:', { totalBookings, totalRevenue, bookingCount: bookings.length });
     
     res.json({ 
        success: true, 
        dashboardData: { 
            totalBookings, 
            totalRevenue, 
            bookings 
        } 
     });
   } catch (error) {
       console.error('Error in getHotelBookings:', error);
       res.json({ 
           success: false, 
           message: "Lỗi khi lấy dữ liệu booking: " + error.message 
       });
   }
};





