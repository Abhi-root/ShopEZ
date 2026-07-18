import express from "express";
import { fetchBanner, updateBanner } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js"; // 

const router = express.Router();


router.get("/fetch-banner", protect, fetchBanner);
router.post("/update-banner", protect, updateBanner);

export default router;
