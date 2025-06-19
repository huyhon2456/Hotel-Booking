//api người dùng
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchCities = req.user.recentSearchCities;
        res.json({ success: true, role, recentSearchCities });
    } catch (error) {
        res.json({ success: false, message: "Lỗi khi lấy dữ liệu người dùng" });
    }
}
//tìm kiếm thành phố gần đây
export const storeRecentSearchCities = async (req, res) => {
    try {
        const { city } = req.body;
        const user = await req.user
        if (user.recentSearchCities.length < 3) {
            user.recentSearchCities.push(city);
        } else {
            user.recentSearchCities.shift(); // Xóa thành phố cũ nhất
            user.recentSearchCities.push(city); // Thêm thành phố mới
        }
        await user.save();
        res.json({ success: true, message: "Thành phố đã được thêm vào tìm kiếm gần đây" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
