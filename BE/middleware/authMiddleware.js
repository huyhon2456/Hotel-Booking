import User from '../models/User.js';

// đã xác thực người dùng hay chưa
export const protect = async (req, res, next) => {
    let userId;

    // Kiểm tra nếu có req.auth từ Clerk
    if (typeof req.auth === 'function') {
        const authData = await req.auth();
        userId = authData && authData.userId;

    } else if (req.auth && typeof req.auth === 'object') {
        userId = req.auth.userId;

    }

    if (!userId) {

        return res.status(401).json({
            success: false,
            message: "Không hợp lệ. Vui lòng đăng nhập lại."
        });
    } else {
        try {
            const user = await User.findById(userId);
            if (!user) {

                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy thông tin người dùng"
                });
            }

            req.user = user;
            next();
        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Lỗi xác thực: " + error.message
            });
        }
    }
}