// Aapka jo bhi Model hai use import karein
// Maan lijiye aapne Banner.js model banaya hai
import Banner from '../models/Banner.js';

// 1. Fetch all banners
export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Update or Create Banner
export const updateBanner = async (req, res) => {
    try {
        const { bannerUrl } = req.body;

        // Purane banner ko delete karke naya add karein ya existing update karein
        // Hum yahan pehle saare purane banners hata rahe hain taaki sirf 1 hi active rahe
        await Banner.deleteMany({}); 

        const newBanner = new Banner({ bannerUrl });
        await newBanner.save();

        res.status(200).json({ message: "Banner updated successfully!", data: newBanner });
    } catch (error) {
        res.status(500).json({ message: "Error updating banner", error: error.message });
    }
};