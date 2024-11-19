import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI as string;
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default dbConnect;
