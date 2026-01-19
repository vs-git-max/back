import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Could not connect to db");
    console.log(error);
    process.exit(1);
  }
}

export default connectDB;
