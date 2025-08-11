import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import contactRouter from './routes/contactRoutes.js';


connectDB()
connectCloudinary()

const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
app.use(clerkMiddleware())

//api của clerk
app.use('/api/clerk', clerkWebhooks)

// Import routes
app.get('/', (req, res) => res.send('API is running'));
app.use('/api/user', userRouter)
app.use('/api/hotel', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/contact', contactRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});