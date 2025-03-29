import { Router } from "express";
import {
  registerUser,
  logOutUser,
  loginUser,
  refreshAccessToken,
  updatePassword,
  getCurrentUser,
  updateDetails,
  updateAvatar,
  upateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
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


//secure routes
router.route("/logout").post(verifyJwtToken, logOutUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, updatePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), upateCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
