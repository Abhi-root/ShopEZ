import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/shop';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`Error in DB connection on startup: ${err.message}`);
    console.error(`Please check if your MONGO_URI is set correctly in Vercel Environment Variables.`);
  }
};

export default connectDB;
