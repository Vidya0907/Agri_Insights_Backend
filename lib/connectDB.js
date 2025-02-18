import mongoose from "mongoose"; // Make sure mongoose is imported

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 40000, // Increase the timeout to 40 seconds
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

export default connectDB; // Ensure default export
