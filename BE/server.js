import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';


connectDB()

const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
app.use(clerkMiddleware())

//api của clerk
app.use('/api/clerk', clerkWebhooks)
// Import routes
app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});