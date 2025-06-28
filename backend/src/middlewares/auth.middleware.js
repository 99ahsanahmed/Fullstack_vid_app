import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/users.models.js"
export const verifyJwtToken = asynchandler(async (req, _, next) => {
    const token = req?.cookies.accessToken || req.header('Authorization').replace("Bearer ","");
    if (!token) {
        throw new ApiError(401, "Token not found");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    ).lean(); 

    if (!user) {
        throw new ApiError(401 , "Invalid acess token")
    }
    req.user = user;
    next()
});
