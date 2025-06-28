import {Router} from "express";
import { restrictTo } from "../middlewares/restrictTo.middleware.js";
import { uploadVideo, getAllVideos } from "../controllers/video.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/uploadVideo").post(
  verifyJwtToken,
  restrictTo("tutor"),
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo,
);

router.route("/getAllVideos").get(getAllVideos);
export default router;