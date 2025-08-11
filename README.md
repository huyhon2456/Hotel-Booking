# 🏨 Hotel Booking (React + Node)

MVP đặt phòng khách sạn: tìm kiếm, xem chi tiết, đặt phòng, thanh toán VNPay, dashboard chủ khách sạn. Giao diện hiện đại, code rõ ràng, dễ demo.

## ✨ Highlights
- Tìm kiếm theo điểm đến, ngày, số khách; xem chi tiết phòng (ảnh, tiện ích, giá)
- Đặt phòng và quản lý đơn cá nhân; thanh toán VNPay (sandbox flow đầy đủ)
- Dashboard chủ khách sạn: thêm phòng (upload Cloudinary), quản lý phòng/đơn
- Đăng nhập qua Clerk; kiến trúc FE/BE rõ ràng; UI Tailwind
- Codebase sẵn demo, dễ triển khai local hoặc Vercel

## 🧱 Tech Stack

### Frontend
- React 19 + Vite 6
- Tailwind CSS 4
- React Router 7
- Axios, React Hot Toast
- Clerk authentication

### Backend
- Node.js + Express 5
- MongoDB + Mongoose 8
- Multer (upload), Cloudinary (images)
- Nodemailer (optional email)
- VNPay (payment gateway)

### DevOps & Deployment
- Vercel (FE/BE), MongoDB Atlas
- Environment variables per environment



## 🚀 Quick Start

### System Requirements
- Node.js 18+ (recommended 20+)
- MongoDB 6+
- npm or yarn

### 1) Clone repository
```bash
git clone https://github.com/huyhon2456/hotel-boking.git
cd hotel-boking
```

### 2) Backend

```bash
cd BE
npm install
```

Tạo `.env` trong thư mục BE:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hotel-booking
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
# Optional email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Frontend URL used for redirects (VNPay return)
FRONTEND_URL=http://localhost:5173

# VNPay configs
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5173/payment-result
```

Chạy backend:
```bash
npm start
```

### 3) Frontend

```bash
cd FE
npm install
```

Tạo `.env` trong thư mục FE:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

```

Chạy frontend:
```bash
npm run dev
```

### 4) Mở ứng dụng
- FE: http://localhost:5173



## � Endpoints (tóm tắt)
- Clerk auth (SaaS) – không có endpoint custom
- User: GET /api/user; POST /api/user/recent-search-cities
- Hotel: POST /api/hotel
- Rooms: GET /api/rooms; POST /api/rooms (multipart, protect); GET /api/rooms/owner; POST /api/rooms/toggle-availability
- Bookings: POST /api/bookings/check-availability; POST /api/bookings/book (protect); GET /api/bookings/user; GET /api/bookings/hotel
- VNPay: POST /api/bookings/vnpay-payment (protect); GET /api/bookings/vnpay-return; GET /api/bookings/vnpay-ipn
- Contact: POST /api/contact


## 👨‍💻 Author

- **Huy Hon** - *Full Stack Developer* - [huyhon2456](https://github.com/huyhon2456)

## 📞 Contact

- Email: huyhon2456@gmail.com
- GitHub: [huyhon2456](https://github.com/huyhon2456)
- Project Link: [https://github.com/huyhon2456/hotel-boking](https://github.com/huyhon2456/hotel-boking)


