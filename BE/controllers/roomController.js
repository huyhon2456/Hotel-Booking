import Hotel from '../models/Hotel.js';
import { v2 as cloudinary } from 'cloudinary';
import Room from '../models/Room.js';


//api để tạo phòng mới
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.user._id });

        if (!hotel) {
            return res.json({
                success: false,
                message: "không tìm thấy khách sạn của bạn"
            });
        }
        //upload ảnh lên cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path)
            return response.secure_url;
        })

        const images = await Promise.all(uploadImages);
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        });
        res.json({
            success: true,
            message: "Tạo phòng thành công"
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message || "Lỗi khi tạo phòng"
        });
    }
}
//api để lấy tất cả phòng
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            select: 'name address contact city', // Thêm rõ các trường cần thiết
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 })
        res.json({ success: true, rooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//api để lấy phòng theo khách sạn cụ thể
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.user._id })
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate({
            path: 'hotel',
            select: 'name address contact city'
        })
        res.json({ success: true, rooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//api lấy theo tính khả dụng của phòng
export const getAvailableRooms = async (req, res) => {
    try {
        const { roomId } = req.body
        const roomData = await Room.findById(roomId)
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Cập nhật trạng thái phòng thành công" });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}