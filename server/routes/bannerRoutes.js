import express from 'express';
import { getAllBanners, updateBanner } from '../controllers/bannerController.js';

const router = express.Router();

// GET route: Banner fetch karne ke liye (Home page ke liye)
router.get('/', getAllBanners);

// POST route: Banner update karne ke liye (Admin page ke liye)
router.post('/', updateBanner); 

export default router;