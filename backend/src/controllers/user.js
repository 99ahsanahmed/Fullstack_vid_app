import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import { delFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user_id) => {
  try {
    const user = await User.findById(user_id); // Fetch user from DB

    if (!user) {
      console.log("User not found");
      throw new ApiError(404, "User not found"); // Handle user not found
    }

    const accessToken = user.generateAcessToken(); // Generate access token
    const refreshToken = user.generateRefreshToken(); // Generate refresh token

    user.refreshToken = refreshToken; // Store refresh token in DB
    await user.save({ validateBeforeSave: false }); // Save without validation

    return { accessToken, refreshToken }; // Return tokens
  } catch (error) {
    throw new ApiError(
      404,
      "something went wrong while generating access and refresh token",
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  // ? VALIDATION - Udemy
  // if (
  //   [fullname, username, email, password].some(
  //     (fields) => fields?.trim() === "",
  //   )
  // ) {
  //   throw new ApiError(409, "All fields are required");
  // }

  // const userExists = await User.findOne({
  //   $or: [{ username }, { email }],
  // });
  // if (userExists) {
  //   throw new ApiError(400, " User with username and email already exists");
  // }

  // ? VALIDATION - Chatgpt
  if (![fullname, username, email, password].every((field) => field?.trim())) {
    throw new ApiError(409, "All fields are required");
  }

  const sanitizedUsername = username.trim().toLowerCase();
  const sanitizedEmail = email.trim().toLowerCase();

  console.log("Incoming Data:", req.body);
  console.log("Sanitized Data:", { sanitizedUsername, sanitizedEmail });

  const userExists = await User.findOne({
    $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }],
  });

  if (userExists) {
    throw new ApiError(
      400,
      `User with username "${userExists.username}" or email "${userExists.email}" already exists`,
    );
  }

  console.warn(req.files);
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar not found");
  }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // Since CoverImg isnt mandatory
  // let coverImg = "";
  // if (coverLocalPath) {
  //     coverImg = await uploadOnCloudinary(coverLocalPath)
  // }

  // ! Uploading on Cloudinary
  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded on Cloudinary", avatar);
  } catch (error) {
    console.log("Error uploading avatar on cloudinary", error);
    throw new ApiError(500, "Failed to upload avatar");
  }

  let coverImage;

  if (coverLocalPath) {
    try {
      coverImage = await uploadOnCloudinary(coverLocalPath);
      console.log("Uploaded on Cloudinary", coverImage);
    } catch (error) {
      console.log("Error uploading cover image to Cloudinary", error);
      throw new ApiError(500, "Failed to upload coverImage");
    }
  }

  //New user to database
  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email: sanitizedEmail,
      password,
      username: sanitizedUsername,
    });

    //MONGOOSE => select is use to deSelect things you dont want to extract
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created Successfully")); //status, data,
  } catch (error) {
    console.log("User creation failed", error);
    if (avatar?.public_id) {
      await delFromCloudinary(avatar.public_id);
    }
    if (coverImage?.public_id) {
      await delFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(
      500,
      "User creation Failed and images were deleted",
      error.message,
    );
  }
});

const loginUser = asynchandler(async (req, res) => {
  //Get data
  const { username, email, password } = req.body;

  //Validate
  const sanitizedUsername = username.trim().toLowerCase();
  const sanitizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }],
  });

  if (!user) {
    throw new ApiError(401, "User with email or usernam doesn't exist");
  }

  //Validate Password
  const validPassword = await user.isPasswordCorrect(password); // isPasswordCorrect method is written in user.models.js
  if (!validPassword) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id); //  return { accessToken, refreshToken }; destructuring return object

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  ); //So that I dont get password and refreshToken

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    ); //{user : loggedInUser , accessToken , refreshToken} is for mobile apps, as they cannot recieve cookies
});

const logOutUser = asynchandler(async (req,res)=>{  //Just delete refresh token from db to logout simple
  await User.findByIdAndUpdate(req.user._id , {
    $unset : {
      refreshToken : 1
    }
  },
  {
    new : true
  }
)

options = {
  httpOnly : true,
  secure : true
}

return res.status(200)
.clearCookie("accessToken" , options)
.clearCookie("refreshToken" , options)
.json(new ApiResponse(200 , {} , "User logged out successfully"))
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN,
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "No resfresh token in db");
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id); //Generating tokens with help of a function
    options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    return res(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError (500, "Something went wrong while refreshing access token", error.message);
  }
});

export { registerUser, loginUser, refreshAccessToken, logOutUser };
