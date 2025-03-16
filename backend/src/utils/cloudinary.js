import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config();

// CONFIGURATION
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    // Uploads an image
    const uploadResult = await cloudinary.uploader.upload(
      filePath,{
        resource_type : 'auto'
      }
    );
    console.log(`File successfully uploaded on cloudinary ${uploadResult.url}`);
    // Once file is uploaded on cloudinary we will delete it from our server
    fs.unlinkSync(filePath);
    return uploadResult;
  } catch (error) {
    console.log("Error on cloudinary",error)
    fs.unlinkSync(filePath); //This is to delete file if something goes wrong
    return null;
  }
};

const delFromCloudinary = async(publicId)=>{
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log("Deleted from Cloudinary")
  } catch (error) {
    console.log("Error deleting from cloudinary" , error)
    return null;
  }
}

export { uploadOnCloudinary, delFromCloudinary };
