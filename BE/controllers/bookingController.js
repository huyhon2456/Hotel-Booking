import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import crypto from "crypto";
import qs from "qs";

//hàm kiểm tra xem phòng có hợp lệ hay k
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        const isAvailable = bookings.length === 0;
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
export const createBooking = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room, guest, paymentMethod } = req.body;
        const user = req.user._id;

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
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice *= nights;

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
        res.json({ success: true, message: "Đặt phòng thành công", booking });
    } catch (error) {
        res.json({ success: false, message: "Booking failed: " + error.message });
    }
};
//api để lấy tất cả booking của user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
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

        const hotel = await Hotel.findOne({ owner: req.user._id });
        

        if (!hotel) {
            return res.json({
                success: false,
                message: "Không tìm thấy khách sạn cho tài khoản này"
            });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate('room hotel user')
            .sort({ createdAt: -1 });
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({
            success: true,
            dashboardData: {
                totalBookings,
                totalRevenue,
                bookings
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Lỗi khi lấy dữ liệu booking: " + error.message
        });
    }
};
//THANH TOÁN VNPAY
export const vnPay = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.json({ success: false, message: "Không tìm thấy mã đặt phòng" });
        }

        // Lấy thông tin booking
        const booking = await Booking.findById(bookingId)
            .populate('room hotel');

        if (!booking) {
            return res.json({ success: false, message: "Không tìm thấy đơn đặt phòng" });
        }

        // Thiết lập môi trường
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);

        // Lấy IP của client
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


        const tmnCode = process.env.VNP_TMN_CODE;
        const secretKey = process.env.VNP_HASH_SECRET;
        const vnpUrl = process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const returnUrl = `${process.env.FRONTEND_URL}/payment-result`;

        // Tạo mã đơn hàng duy nhất
        let orderId = `${bookingId}-${Date.now()}`;
        let amount = booking.totalPrice;
        let bankCode = req.body.bankCode || "";
        let locale = req.body.language || "vn";
        let currCode = 'VND';
        // Tạo các tham số cho VNPAY
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = `Thanh toan dat phong khach san: ${booking.hotel.name}, Phong: ${booking.room.name}, Ma don: ${bookingId}`;
        vnp_Params['vnp_OrderType'] = 'billpayment';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        if (bankCode && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);
        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(signData).digest("hex");

        vnp_Params['vnp_SecureHash'] = signed;
        let paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });

        // Lưu thông tin thanh toán vào booking
        booking.paymentMethod = 'VNPay';
        booking.paymentDetails = {
            orderId: orderId,
            amount: amount,
            status: 'pending'
        };
        await booking.save();

        return res.json({
            success: true,
            message: "Tạo URL thanh toán thành công",
            paymentUrl: paymentUrl
        });

    } catch (error) {
        console.error("VNPay Error:", error);
        return res.json({
            success: false,
            message: "Lỗi khi tạo URL thanh toán: " + error.message
        });
    }
};

export const vnPayReturn = async (req, res) => {
    try {


        // Lấy tham số từ VNPay trả về
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];
        // Xóa các trường không cần thiết để xác minh
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        // Sắp xếp các tham số
        vnp_Params = sortObject(vnp_Params);
        // Lấy cấu hình VNPay từ environment variables
        const secretKey = process.env.VNP_HASH_SECRET;
        // Tạo chuỗi hash để xác minh
        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(signData).digest("hex");
        // Kiểm tra hash có trùng khớp không
        if (secureHash === signed) {
            // Lấy mã đặt phòng từ mã giao dịch VNPay
            const txnRef = vnp_Params['vnp_TxnRef'];
            const bookingId = txnRef.split('-')[0];
            // Kiểm tra mã giao dịch
            const responseCode = vnp_Params['vnp_ResponseCode'];
            // Tìm booking tương ứng - thêm timeout để tránh chờ quá lâu
            console.log(`Đang tìm booking với id: ${bookingId}`);
            let booking;
            try {
                // Thiết lập timeout 5 giây để tránh treo ứng dụng nếu DB phản hồi chậm
                const bookingPromise = Booking.findById(bookingId);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Database timeout')), 5000)
                );
                booking = await Promise.race([bookingPromise, timeoutPromise]);
                if (!booking) {
                    console.log(`Không tìm thấy booking với id: ${bookingId}`);
                    return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error&message=Không tìm thấy đơn đặt phòng`);
                }
            } catch (err) {
                console.error(`Lỗi khi tìm booking: ${err.message}`);
                return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error&message=Lỗi kết nối database: ${err.message}`);
            }

            if (responseCode === '00') {
                // Thanh toán thành công
                try {
                    booking.isPaid = true;
                    booking.status = 'confirmed';
                    booking.paymentDetails = {
                        ...booking.paymentDetails,
                        status: 'completed',
                        transactionDate: new Date(),
                        transactionId: vnp_Params['vnp_TransactionNo'] || '',
                        paymentInfo: vnp_Params
                    };

                    // Lưu chi tiết từng tham số để dễ truy xuất
                    Object.keys(vnp_Params).forEach(key => {
                        booking.paymentDetails[key] = vnp_Params[key];
                    });

                    await booking.save();
                    // Redirect với tham số vnp_TxnRef để frontend có thể lấy lại bookingId
                    const redirectUrl = `${process.env.FRONTEND_URL}/payment-result?status=success&id=${bookingId}`;
                    console.log(`Chuyển hướng đến: ${redirectUrl}`);
                    return res.redirect(redirectUrl);
                } catch (err) {
                    console.error(`Lỗi khi lưu booking thành công: ${err.message}`);
                    return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error&message=Lỗi cập nhật dữ liệu`);
                }
            } else {
                // Thanh toán thất bại
                try {
                    booking.paymentDetails = {
                        ...booking.paymentDetails,
                        status: 'failed',
                        message: `Mã lỗi: ${responseCode}`
                    };
                    await booking.save();


                    return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error&code=${responseCode}`);
                } catch (err) {
                    console.error(`Lỗi khi lưu booking thất bại: ${err.message}`);
                    return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error&message=Lỗi cập nhật dữ liệu&code=${responseCode}`);
                }
            }
        } else {
            // Hash không trùng khớp, có thể bị giả mạo
            return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error&message=Xác thực không hợp lệ`);
        }

    } catch (error) {
        console.error("VNPay Return Error:", error);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error&message=Đã xảy ra lỗi`);
    }
};

export const vnPayIPN = async (req, res) => {
    try {
        // Lấy tham số từ VNPay trả về
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        // Xóa các trường không cần thiết để xác minh
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Sắp xếp các tham số
        vnp_Params = sortObject(vnp_Params);

        // Lấy cấu hình VNPay từ environment variables
        const secretKey = process.env.VNP_HASH_SECRET;

        // Tạo chuỗi hash để xác minh
        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(signData).digest("hex");

        // Kiểm tra hash có trùng khớp không
        if (secureHash === signed) {
            // Lấy mã đặt phòng từ mã giao dịch VNPay
            const txnRef = vnp_Params['vnp_TxnRef'];
            const bookingId = txnRef.split('-')[0]; // Lấy phần đầu tiên của txnRef

            // Kiểm tra mã giao dịch
            const responseCode = vnp_Params['vnp_ResponseCode'];

            // Tìm booking tương ứng với timeout
            console.log(`[IPN] Đang tìm booking với id: ${bookingId}`);
            let booking;

            try {
                // Thiết lập timeout 5 giây
                const bookingPromise = Booking.findById(bookingId);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Database timeout')), 5000)
                );

                booking = await Promise.race([bookingPromise, timeoutPromise]);

                if (!booking) {
                    console.log(`[IPN] Không tìm thấy booking với id: ${bookingId}`);
                    return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
                }

                console.log(`[IPN] Đã tìm thấy booking: ${booking._id}`);
            } catch (err) {
                console.error(`[IPN] Lỗi khi tìm booking: ${err.message}`);
                return res.status(200).json({ RspCode: '99', Message: `Database error: ${err.message}` });
            }

            // Kiểm tra số tiền có đúng không
            const amount = +vnp_Params['vnp_Amount'] / 100; // VNPay trả về số tiền * 100

            if (amount !== booking.totalPrice) {
                return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
            }

            // Nếu booking đã được cập nhật trạng thái thanh toán
            if (booking.isPaid) {
                return res.status(200).json({ RspCode: '02', Message: 'Order already updated to the payment status' });
            }

            if (responseCode === '00') {
                // Thanh toán thành công
                booking.isPaid = true;
                booking.status = 'confirmed';
                booking.paymentDetails = {
                    ...booking.paymentDetails,
                    status: 'completed',
                    transactionDate: new Date(),
                    transactionId: vnp_Params['vnp_TransactionNo'] || ''
                };
                await booking.save();

                return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            } else {
                // Thanh toán thất bại
                booking.paymentDetails = {
                    ...booking.paymentDetails,
                    status: 'failed',
                    message: `Mã lỗi: ${responseCode}`
                };
                await booking.save();

                return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            }
        } else {
            // Hash không trùng khớp, có thể bị giả mạo
            return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
        }

    } catch (error) {
        console.error("VNPay IPN Error:", error);
        return res.status(500).json({ RspCode: '99', Message: 'Unknown error' });
    }
};

// Hàm sắp xếp object theo thứ tự alphabet
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.json({ success: false, message: "Không tìm thấy mã đặt phòng" });
        }

        // Tìm booking
        const booking = await Booking.findById(bookingId).populate('room hotel');

        if (!booking) {
            return res.json({ success: false, message: "Không tìm thấy đơn đặt phòng" });
        }

        // Kiểm tra quyền truy cập (chỉ cho phép chính chủ đơn hàng xem)
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: "Không có quyền truy cập đơn hàng này" });
        }

        return res.json({
            success: true,
            isPaid: booking.isPaid,
            status: booking.status,
            paymentDetails: booking.paymentDetails,
            booking: {
                _id: booking._id,
                isPaid: booking.isPaid,
                status: booking.status,
                paymentMethod: booking.paymentMethod,
                totalPrice: booking.totalPrice,
                hotel: {
                    name: booking.hotel.name,
                    address: booking.hotel.address
                },
                room: {
                    name: booking.room.name,
                    roomType: booking.room.roomType
                }
            }
        });

    } catch (error) {
        console.error("Error checking payment status:", error);
        return res.json({
            success: false,
            message: "Lỗi khi kiểm tra trạng thái thanh toán: " + error.message
        });
    }
};

// Cập nhật trạng thái thanh toán từ frontend
export const updatePaymentStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { vnpResponse } = req.body;

        console.log('=== ĐANG CẬP NHẬT TRẠNG THÁI THANH TOÁN ===');
        console.log('BookingId:', bookingId);
        console.log('Dữ liệu VNPay nhận được:', JSON.stringify(vnpResponse, null, 2));

        if (!bookingId) {
            console.log('Lỗi: Không có bookingId');
            return res.json({ success: false, message: "Không tìm thấy mã đặt phòng" });
        }

        // Tìm booking
        console.log('Đang tìm booking trong database...');
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            console.log('Lỗi: Không tìm thấy booking với ID:', bookingId);
            return res.json({ success: false, message: "Không tìm thấy đơn đặt phòng" });
        }

        console.log('Đã tìm thấy booking:', booking._id);
        console.log('Trạng thái hiện tại - isPaid:', booking.isPaid, 'status:', booking.status);

        if (req.user && req.user._id && booking.user.toString() !== req.user._id.toString()) {
            console.log('Cảnh báo: Người dùng khác đang cập nhật booking này');
            console.log('User của booking:', booking.user.toString());
            console.log('User từ request:', req.user._id.toString());
            // Không return ngay mà vẫn cho phép cập nhật
        }

        // Kiểm tra xem đơn hàng đã được thanh toán chưa
        if (booking.isPaid) {
            console.log('Booking đã được thanh toán trước đó, không cần cập nhật');
            return res.json({
                success: true,
                message: "Đơn hàng đã được thanh toán trước đó",
                isPaid: true,
                booking: {
                    _id: booking._id,
                    isPaid: booking.isPaid,
                    status: booking.status
                }
            });
        }

        // Xác thực dữ liệu VNPay
        if (vnpResponse) {
            console.log('Xác thực dữ liệu VNPay...');

            // Kiểm tra mã phản hồi VNPay
            const responseCode = vnpResponse.vnp_ResponseCode;
            const transactionStatus = vnpResponse.vnp_TransactionStatus;
            console.log('Mã phản hồi VNPay:', responseCode);
            console.log('Trạng thái giao dịch:', transactionStatus);
            if (responseCode === '00' && transactionStatus === '00') {
                console.log('Xác thực thành công, đang cập nhật trạng thái thanh toán...');

                try {
                    // Cập nhật trạng thái thanh toán
                    booking.isPaid = true;
                    booking.status = 'confirmed';
                    booking.paymentDetails = {
                        ...booking.paymentDetails,
                        status: 'completed',
                        transactionDate: new Date(),
                        transactionId: vnpResponse.vnp_TransactionNo || '',
                        paymentInfo: vnpResponse
                    };

                    const updatedBooking = await booking.save();
                    console.log('Đã cập nhật booking thành công:', updatedBooking._id);
                    console.log('Trạng thái mới - isPaid:', updatedBooking.isPaid, 'status:', updatedBooking.status);

                    return res.json({
                        success: true,
                        message: "Cập nhật trạng thái thanh toán thành công",
                        isPaid: true,
                        booking: {
                            _id: updatedBooking._id,
                            isPaid: updatedBooking.isPaid,
                            status: updatedBooking.status,
                            paymentDetails: updatedBooking.paymentDetails
                        }
                    });
                } catch (saveError) {
                    console.error('Lỗi khi lưu booking:', saveError);
                    return res.json({
                        success: false,
                        message: "Lỗi khi cập nhật trạng thái: " + saveError.message
                    });
                }
            } else {
                console.log('Mã phản hồi không thành công, không cập nhật trạng thái');
            }
        }
        // Nếu không có dữ liệu VNPay hoặc mã không thành công
        console.log('Không có dữ liệu VNPay hợp lệ, không cập nhật trạng thái');
        return res.json({
            success: false,
            message: "Dữ liệu thanh toán không hợp lệ hoặc không thành công",
            booking: {
                _id: booking._id,
                isPaid: booking.isPaid,
                status: booking.status
            }
        });

    } catch (error) {
        console.error("Error updating payment status:", error);
        return res.json({
            success: false,
            message: "Lỗi khi cập nhật trạng thái thanh toán: " + error.message
        });
    }
};

