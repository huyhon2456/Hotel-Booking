import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    checkAvailabilityAPI, 
    createBooking, 
    getHotelBookings, 
    getUserBookings,
    vnPay,
    vnPayReturn,
    vnPayIPN,
    checkPaymentStatus,
    updatePaymentStatus
} from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);

// Routes cho thanh toán VNPay
bookingRouter.post('/vnpay-payment', protect, vnPay);
bookingRouter.get('/vnpay-return', vnPayReturn); 
bookingRouter.get('/vnpay-ipn', vnPayIPN);
bookingRouter.get('/check-payment/:bookingId', protect, checkPaymentStatus); // Kiểm tra trạng thái thanh toán
bookingRouter.post('/update-payment/:bookingId', protect, updatePaymentStatus); // Cập nhật trạng thái thanh toán từ frontend

export default bookingRouter;