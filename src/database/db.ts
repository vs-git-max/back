import mongoose from "mongoose";

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("Mongodb uri environment variable is not defined");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Could not connect to db");
    console.error(error);
    process.exit(1);
  }
}

export default connectDB;
