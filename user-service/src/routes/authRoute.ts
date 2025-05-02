import { Router } from "express";
import {
  login,
  resendOtp,
  signup,
  verifyOtp,
} from "../controllers/authController";
import upload from "../config/multer";
import {
  loginSchema,
  resendOtpSchema,
  signupSchema,
  verifyOtpSchema,
} from "../schemas";
import {
  validateRequestBody,
  verifyAccessOrRefreshToken,
} from "../middlewares";

const authRouter = Router();

authRouter
  .route("/signup")
  .post(
    upload.single("profileImage"),
    validateRequestBody(signupSchema),
    signup
  );

authRouter
  .route("/verify-otp")
  .post(validateRequestBody(verifyOtpSchema), verifyOtp);

authRouter
  .route("/resend-otp")
  .post(validateRequestBody(resendOtpSchema), resendOtp);

authRouter.route("/refresh-token").post(verifyAccessOrRefreshToken("refresh"));

authRouter.route("/login").post(validateRequestBody(loginSchema), login);
export default authRouter;
