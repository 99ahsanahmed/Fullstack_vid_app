import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import { delFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { mongo } from "mongoose";

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

// const loginUser = asynchandler(async (req, res) => {
//   //Get data
//   const { username, email, password } = req.body;

//   //Validate
//   const sanitizedUsername = username.trim().toLowerCase();
//   const sanitizedEmail = email.trim().toLowerCase();
//   const user = await User.findOne({
//     $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }],
//   });

//   if (!user) {
//     throw new ApiError(401, "User with email or usernam doesn't exist");
//   }

//   //Validate Password
//   const validPassword = await user.isPasswordCorrect(password); // isPasswordCorrect method is written in user.models.js
//   if (!validPassword) {
//     throw new ApiError(401, "Incorrect password");
//   }

//   const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id); //  return { accessToken, refreshToken }; destructuring return object

//   const loggedInUser = await User.findById(user._id).select(
//     "-password -refreshToken",
//   ); //So that I dont get password and refreshToken

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(
//         200,
//         { user: loggedInUser, accessToken, refreshToken },
//         "User logged in successfully",
//       ),
//     ); //{user : loggedInUser , accessToken , refreshToken} is for mobile apps, as they cannot recieve cookies
// });

const loginUser = asynchandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully",
      ),
    );
});

const logOutUser = asynchandler(async (req, res) => {
  //Just delete refresh token from db to logout simple
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
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
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token",
      error.message,
    );
  }
});

const updatePassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  // if (user.password !== oldPassword) {
  //   throw new ApiError(401, "Incorrect password")
  // }
  //? We have a built in function for it :
  const validPassword = user.isPasswordCorrect(oldPassword);

  if (!validPassword) {
    throw new ApiError(401, "Incorrect old password");
  }

  user.password = newPassword; // There is a method in my user.model which will decrypt password before saving
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateDetails = asynchandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(401, "Fullname and email is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email, // key is part of mongodb and value is coming from req.body
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated sucessfully"));
});

const upateAvatar = asynchandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, "User not authorized");
  }
  const oldAvatar = user.avatar;

  const avatarLocalPath = req.file?.path; // req.file returns an object from which path is one (key:value) property
  if (!avatarLocalPath) {
    throw new ApiError(401, "File not being uploaded");
  }

  // 🔴 Delete old avatar if it exists
  if (oldAvatar) {
    const oldAvatarPublicId = oldAvatar.split("/").pop().split(".")[0]; // Extract public_id
    await delFromCloudinary(oldAvatarPublicId); // Delete from Cloudinary
  }

  // 🟢 Upload new avatar
  const newAvatar = await uploadOnCloudinary(avatarLocalPath);

  if (!newAvatar.url) {
    throw new ApiError(401, "Error while uploading avatar");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: newAvatar.url,
      },
    },
    {
      new: true,
    },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated sucessfully"));
});

const upateCoverImage = asynchandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, "User not authorized");
  }
  const oldCover = user.coverImage;

  const coverImageLocalPath = req.file?.path; // req.file returns an object from which path is one (key:value) property
  if (!coverImageLocalPath) {
    throw new ApiError(401, "File not being uploaded");
  }

  // 🔴 Delete old avatar if it exists
  if (oldCover) {
    const oldCoverPublicId = oldCover.split("/").pop().split(".")[0]; // Extract public_id
    await delFromCloudinary(oldAvatarPublicId); // Delete from Cloudinary
  }

  // 🟢 Upload new avatar
  const newCoverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!newCoverImage.url) {
    throw new ApiError(401, "Error while uploading avatar");
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        coverImage: newCoverImage.url,
      },
    },
    {
      new: true,
    },
  ).select("-password refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated sucessfully"));
});

const getUserChannelProfile = asynchandler(async(req,res) => {
  const {username} = req.params
  if (!username?.trim()) {
    throw new ApiError(400, "username is missing")
  }

  const channel = User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "Subscription",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers", // (i.e., this user follows others).
      },
    },
    {
      $lookup: {
        from: "Subscription",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo", //(i.e., this user has followers).
      },
    },
    {
      $addFields: {
        subscibersCount: {
          $size: "$subscibers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

   if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
});

const getWatchHistory = asynchandler(async (req, res) => {
  const user = User.aggregate([
    {
      $match: {
        _id: new monngoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos", //mongodb automatically small letters and pluralise them
        localField: "watchHistory", //in users schema
        foreignField: "_id", //_id in videos
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users", //since I am in videos
              localField: "owner", //owner field in videos
              foreignField: "_id", // user id
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner", //same name so that it becomes object from an array
              },
            },
          },
        ],
      },
    },
  ]);
   return res.status(200).json(
     new ApiResponse(
       200,
       user[0].watchHistory, //Even if only one user is found, it is still wrapped inside an array.
       "Watch history fetched successfully",
     ),
   );
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logOutUser,
  updatePassword,
  getCurrentUser,
  updateDetails,
  upateAvatar,
  upateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
