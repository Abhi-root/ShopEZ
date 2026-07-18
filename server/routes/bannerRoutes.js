import express from 'express';
import { getAllBanners, updateBanner } from '../controllers/bannerController.js';

const router = express.Router();


router.get('/', getAllBanners);


router.post('/', updateBanner); 

export default router;