import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/shop';
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected');
  } catch (err) {
  console.error(err);
}
};

export default connectDB;
