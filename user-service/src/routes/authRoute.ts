import { Router } from "express";
import {
  changeEmail,
  forgotPassword,
  login,
  oAuth,
  resendOtp,
  resetPassword,
  signup,
  verifyOtp,
} from "../controllers/authController";
import upload from "../config/multer";
import {
  loginSchema,
  emailSchema,
  signupSchema,
  verifyOtpSchema,
} from "../schemas";
import {
  validateRequestBody,
  verifyAccessOrRefreshToken,
} from "../middlewares";
import resetPasswordSchema from "../schemas/resetPasswordSchema";
import changeEmailSchema from "../schemas/changeEmailSchema";
import passport from "passport";

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
  .post(validateRequestBody(emailSchema), resendOtp);

authRouter.route("/refresh-token").post(verifyAccessOrRefreshToken("refresh"));

authRouter.route("/login").post(validateRequestBody(loginSchema), login);

authRouter
  .route("/forgot-password")
  .post(validateRequestBody(emailSchema), forgotPassword);

authRouter
  .route("/reset-password")
  .post(validateRequestBody(resetPasswordSchema), resetPassword);

authRouter
  .route("/change-email")
  .post(
    verifyAccessOrRefreshToken("access"),
    validateRequestBody(changeEmailSchema),
    changeEmail
  );

authRouter.route("/google").get(
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })
);

authRouter.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
    // failureRedirect: "/auth",
  }),
  oAuth
);

authRouter.route("/github").get(
  passport.authenticate("github", {
    session: false,
    scope: ["email", "profile"],
  })
);

authRouter.route("/github/callback").get(
  passport.authenticate("github", {
    session: false,
    // failureRedirect: "/auth",
  }),
  oAuth
);

export default authRouter;
