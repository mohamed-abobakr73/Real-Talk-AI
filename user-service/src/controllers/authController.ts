import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import authServices from "../services/authServices";
import httpStatusText from "../utils/httpStatusText";
import sendOtpToEmail from "../utils/otpUtils/sendOtpToEmail";

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

    // const tokenPayload = {
    //   id: createdUser.userId,
    //   email: createdUser.email,
    // };

    // const token = generateJWT(tokenPayload);

    const sendEmail = await sendOtpToEmail(email, username);

    return res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: {
        message: `Account created successfully, Please verify your email using the OTP sent to ${email}`,
      },
    });
  }
);

const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const validatedRequestBody = req.validatedData;
  const { email, otp } = validatedRequestBody;

  const otpVerificationResult = await authServices.verifyOtpService(email, otp);

  const { user, token, refreshToken } = otpVerificationResult;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      message: "OTP verified successfully",
      user,
      token,
    },
  });
});

export { signup, verifyOtp };
