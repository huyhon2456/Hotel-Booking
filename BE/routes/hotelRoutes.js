import express from 'express';
import { registerHotels } from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js';

const hotelRouter = express.Router();

hotelRouter.post('/', protect, registerHotels)

export default hotelRouter;