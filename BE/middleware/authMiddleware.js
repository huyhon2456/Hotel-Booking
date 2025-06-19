import User from '../models/User.js';

// đã xác thực người dùng hay chưa
export const protect = async (req, res, next) => {
    let userId;
    if (typeof req.auth === 'function') {
        const authData = await req.auth();
        userId = authData && authData.userId;
    } else if (req.auth && typeof req.auth === 'object') {
        userId = req.auth.userId;
    }
    if (!userId) {
        return res.status(401).json({ success: false, message: "không hợp lệ" });
    } else {
        const user = await User.findById(userId);
        req.user = user;
        next();
    }
}