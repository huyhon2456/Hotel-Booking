import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: "User" },
    room: { type: String, required: true, ref: "Room" },
    hotel: { type: String, required: true, ref: "Hotel" },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "Pay At Hotel",
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paymentDetails: {
        orderId: String, // Mã đơn hàng VNPay
        amount: Number, // Số tiền thanh toán
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'cancelled'],
            default: 'pending'
        },
        transactionId: String, // Mã giao dịch từ VNPay
        transactionDate: Date, // Ngày thanh toán
        message: String // Thông báo lỗi nếu có
    }

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;