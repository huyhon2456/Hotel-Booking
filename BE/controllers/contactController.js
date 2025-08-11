export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' })
    }
    // In a real app, store to DB or send email via nodemailer
    return res.json({ success: true, message: 'Đã nhận liên hệ' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}
