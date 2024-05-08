import mongoose from "mongoose";

export const connectDb = async () => {
  //   console.log("process.env.db_uri", process.env.db_uri);
  try {
    const connection = await mongoose.connect(process.env.db_uri);
    console.log("🚀 MongoDB connected success!!!🚀 ");
  } catch (error) {
    console.log(error);
  }
};
