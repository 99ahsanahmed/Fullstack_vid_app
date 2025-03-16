import { ApiError } from "../utils/ApiError";
import { asynchandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import {User} from "../models/users.models.js"
export const verifyJwtToken = asynchandler(async (req, _, next) => {
    const token = req?.cookies.accessToken || req.header('Authorization').replace("Bearer ","");
    if (!token) {
        throw new ApiError(401, "Token not found");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    
    const user = User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    ); 

    if (!user) {
        throw new ApiError(401 , "Invalid acess token")
    }
    req.user = user;
    next()
});
