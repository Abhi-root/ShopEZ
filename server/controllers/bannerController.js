
import Banner from '../models/Banner.js';


export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateBanner = async (req, res) => {
    try {
        const { bannerUrl } = req.body;

        await Banner.deleteMany({}); 

        const newBanner = new Banner({ bannerUrl });
        await newBanner.save();

        res.status(200).json({ message: "Banner updated successfully!", data: newBanner });
    } catch (error) {
        res.status(500).json({ message: "Error updating banner", error: error.message });
    }
};