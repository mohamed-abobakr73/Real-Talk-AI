import { NextFunction, Request, Response } from "express";
import authServices from "../services/authServices";
import httpStatusText from "../utils/httpStatusText";
import sendOtpToEmail from "../utils/otpUtils/sendOtpToEmail";
import { sendRefreshTokenToCookies } from "../utils/jwtUtils";
import { asyncHandler } from "../middlewares";
import usersServices from "../services/usersServices";
import "../types/express";
import OAuthServices from "../services/OAuthServices";

const signup = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const validatedRequestBody = req.validatedData;
    const { email, username } = validatedRequestBody;
    if (req.file) validatedRequestBody.profileImage = req.file.buffer;

    const createdUser = await authServices.signupService(validatedRequestBody);

    const sendEmail = await sendOtpToEmail(email, username);

    return res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: `Account created successfully, Please verify your email using the OTP sent to ${email}`,
      },
    });
  }
);

const verifyOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedRequestBody = req.validatedData;
    const { email, otp } = validatedRequestBody;

    const otpVerificationResult = await authServices.verifyOtpService(
      email,
      otp
    );

    const { user, token, refreshToken } = otpVerificationResult;

    sendRefreshTokenToCookies(res, refreshToken);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: "OTP verified successfully",
        user,
        token,
      },
    });
  }
);

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedRequestBody = req.validatedData;
    const { email, password } = validatedRequestBody;

    const loginResult = await authServices.loginService(email, password);

    const { user, token, refreshToken } = loginResult;

    sendRefreshTokenToCookies(res, refreshToken);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: "Login successful",
        user,
        token,
      },
    });
  }
);

const resendOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedRequestBody = req.validatedData;
    const { email } = validatedRequestBody;

    const user = await authServices.resendOtpService(email);

    const sendEmail = await sendOtpToEmail(email, user.username);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: `OTP resent successfully to ${email}`,
      },
    });
  }
);

const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedRequestBody = req.validatedData;
    const { email } = validatedRequestBody;

    const user = await usersServices.getUserService(email);

    const sendEmail = await sendOtpToEmail(email, user.username);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: `OTP code has been sent to successfully to ${email}, please use it to reset your password`,
      },
    });
  }
);

const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedRequestBody = req.validatedData;
    const { email, otp, newPassword } = validatedRequestBody;

    const resetPasswordResult = await authServices.resetPasswordService(
      email,
      newPassword,
      otp
    );

    const { user, token, refreshToken } = resetPasswordResult;

    sendRefreshTokenToCookies(res, refreshToken);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: "Password reset successfully",
        user,
        token,
      },
    });
  }
);

const changeEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedRequestBody = req.validatedData;
    const { newEmail } = validatedRequestBody;
    const oldEmail = req.currentUser?.email;

    const updatedUser = await authServices.changeEmailService(
      oldEmail!,
      newEmail
    );

    const sendEmail = sendOtpToEmail(newEmail, updatedUser.username);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: `Email changed successfully, And OTP code sent to ${newEmail} for verification`,
        user: updatedUser,
      },
    });
  }
);

const googleAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = req.profile;

    const user = await OAuthServices.googleAuthService(profile!);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: "Login successful",
        user,
      },
    });
  }
);

export {
  signup,
  verifyOtp,
  login,
  resendOtp,
  forgotPassword,
  resetPassword,
  changeEmail,
  googleAuth,
};
