import { NextFunction, Request, Response } from "express";
import authServices from "../services/authServices";
import httpStatusText from "../utils/httpStatusText";
import sendOtpToEmail from "../utils/otpUtils/sendOtpToEmail";
import { sendRefreshTokenToCookies } from "../utils/jwtUtils";
import { asyncHandler } from "../middlewares";

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

  sendRefreshTokenToCookies(res, refreshToken);

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      message: "OTP verified successfully",
      user,
      token,
    },
  });
});

const login = asyncHandler(async (req: Request, res: Response) => {
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
});

export { signup, verifyOtp, login };
