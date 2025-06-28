import { Router } from "express";
import {
  registerUser,
  logOutUser,
  loginUser,
  refreshAccessToken,
  updatePassword,
  getCurrentUser,
  updateDetails,
  upateAvatar,
  upateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  getAllTutors
} from "../controllers/user.js";
import {upload}  from "../middlewares/multer.middleware.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);


router.route("/login").post(loginUser);
//secure routes
router.route("/logout").post(verifyJwtToken, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwtToken, updatePassword);
router.route("/current-user").get(verifyJwtToken, getCurrentUser);
router.route("/getAllTutors").get( verifyJwtToken , getAllTutors)
router.route("/update-account").patch(verifyJwtToken, updateDetails);
router
  .route("/avatar")
  .patch(verifyJwtToken, upload.single("avatar"), upateAvatar);
router
  .route("/cover-image")
  .patch(verifyJwtToken, upload.single("coverImage"), upateCoverImage);
router.route("/c/:username").get(verifyJwtToken, getUserChannelProfile);
router.route("/history").get(verifyJwtToken, getWatchHistory);

export default router;
