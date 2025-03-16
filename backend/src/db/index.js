import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; //It is a named export, it can do multiple imports from module, It is not a default export

const connectDb = async () => {
  try {
     mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`Mongodb Connected `)

  } catch (error) {
    console.log("Mongodb connection failed", error);
    process.exit(1);
  }
};
export default connectDb;
