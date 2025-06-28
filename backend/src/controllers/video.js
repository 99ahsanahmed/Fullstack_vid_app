import { Video } from "../models/video.models.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, delFromCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asynchandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  console.log(req.body)
  console.log(req.files)
  if (!title?.trim() || !description?.trim() || !duration) {
    throw new ApiError(409, "title,description and duration is required");
  }
  if (!(videoLocalPath && thumbnailLocalPath)) {
    throw new ApiError(409, "Video and thumbnail is required");
  }

  let uploadVid;
  try {
    uploadVid = await uploadOnCloudinary(videoLocalPath);
  } catch (error) {
    throw new ApiError(409, "Error uploading video");
  }

  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  } catch (error) {
    throw new ApiError(409, "Error uploading video");
  }

  try {
    const video = await Video.create({
      title,
      description,
      duration,
      videoFile: uploadVid.url,
      thumbnail: thumbnail.url,
      owner: req.user?._id,
    });

    if (!video) {
      throw new ApiError(409, "Something went wrong and video upload failed");
    }

    return res
      .status(201)
      .json(new ApiResponse(video, 201, "Video Uploaded successfully"));
  } catch (error) {
    console.log("Video upload failed", error);
    if (uploadVid?.public_id) {
      await delFromCloudinary(uploadVid.public_id);
    }
    if (thumbnail?.public_id) {
      await delFromCloudinary(thumbnail.public_id);
    }
    throw new ApiError(
      500,
      "Video upload failed and were deleted",
      error.message,
    );
  }
});

const getAllVideos = asynchandler(async (req, res)=>{
  const {
    limit = 10,
    page = 1,
    query = "",
    sortby = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const matchStage = {};

  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { "ownerInfo.username": { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    matchStage.owner = userId;
  }

  const sortStage = { [sortby]: sortType === "asc" ? 1 : -1 }; //[sortby] = createdAt, JS_101
  const skipStage = ( page - 1) * limit;

  const aggregationPipeline = [
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    { $unwind: "$ownerInfo" },
    {
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { "ownerInfo.username": { $regex: query, $options: "i" } },
        ],
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        uploadVid: 1,
        thumbnail: 1,
        duration: 1,
        createdAt: 1,
        videoFile: 1,
        owner: {
          _id: "$ownerInfo._id",
          username: "$ownerInfo.username",
          avatar: "$ownerInfo.avatar",
          company: "$ownerInfo.company",
          city: "$ownerInfo.city",
        },
      },
    },
    { $sort: sortStage },
    { $skip: skipStage },
    { $limit: Number(limit) },
  ];


  const videos = await Video.aggregate(aggregationPipeline);
  const total = await Video.countDocuments(matchStage);

  res
    .status(200)
    .json(
      new ApiResponse({ videos, total }, 200, "Videos fetched successfully"),
    );
});

export { uploadVideo, getAllVideos };
