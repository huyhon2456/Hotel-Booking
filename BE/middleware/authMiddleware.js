import User from '../models/User.js';

// đã xác thực người dùng hay chưa
export const protect = async (req, res, next) => {
    let userId;
    // Log để debug
    console.log('Auth Headers:', req.headers.authorization);
    console.log('Auth Object:', req.auth);

    // Kiểm tra nếu có req.auth từ Clerk
    if (typeof req.auth === 'function') {
        const authData = await req.auth();
        userId = authData && authData.userId;
        console.log('Auth from function:', userId);
    } else if (req.auth && typeof req.auth === 'object') {
        userId = req.auth.userId;
        console.log('Auth from object:', userId);
    }

    if (!userId) {
        console.log('Authentication failed. No valid user ID found.');
        return res.status(401).json({ 
            success: false, 
            message: "Không hợp lệ. Vui lòng đăng nhập lại."
        });
    } else {
        try {
            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found in database:', userId);
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy thông tin người dùng"
                });
            }
            console.log('User authenticated:', user.username);
            req.user = user;
            next();
        } catch (error) {
            console.error('Error finding user:', error);
            return res.status(500).json({
                success: false,
                message: "Lỗi xác thực: " + error.message
            });
        }
    }
}