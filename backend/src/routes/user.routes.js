import { Router } from "express";
import { registerUser, logOutUser } from "../controllers/user.js";
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

export default router;
