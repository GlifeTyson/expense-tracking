import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI);
    console.log("🚀 MongoDB connected success!!!🚀 ");
  } catch (error) {
    console.log(error);
  }
};
