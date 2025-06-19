import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSearchCities } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/',protect, getUserData )
userRouter.post('/recent-search-cities', protect, storeRecentSearchCities);

export default userRouter;