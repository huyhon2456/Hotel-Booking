import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// Lấy danh sách khách sạn
export const registerHotels = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;

        // Kiểm tra xem người dùng đã đăng ký khách sạn chưa
        const hotel = await Hotel.findOne({ owner });
        if (hotel) {
            return res.json({ success: false, message: "Bạn đã đăng ký khách sạn rồi" });
        }
        await Hotel.create({
            name,
            address,
            contact,
            city,
            owner
        });
        await User.findByIdAndUpdate(owner, { role: "hotelOwner" });
        res.json({ success: true, message: "Đăng ký khách sạn thành công" });
    } catch (error) {
        res.json({ success: false, message: "Lỗi khi lấy danh sách khách sạn" });
    }
};