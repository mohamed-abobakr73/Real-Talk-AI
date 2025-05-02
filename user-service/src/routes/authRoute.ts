import { Router } from "express";
import { signup, verifyOtp } from "../controllers/authController";
import upload from "../config/multer";
import validateRequestBody from "../middlewares/validateRequestBody";
import { signupSchema } from "../schemas";
import verifyOtpSchema from "../schemas/verifyOTPSchema";
import verifyAccessOrRefreshToken from "../middlewares/verifyAccessOrRefreshToken";

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

authRouter.route("/refresh-token").post(verifyAccessOrRefreshToken("refresh"));
export default authRouter;
