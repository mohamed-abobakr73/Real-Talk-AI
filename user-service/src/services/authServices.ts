import prisma from "../config/prismaClient";
import type { User } from "../generated/prisma";
import uploadToImageKit from "../utils/uploadToImageKit";
import hashKey from "../utils/hashingUtils/hashKey";
import usersServices from "./usersServices";
import verifyOtpCode from "../utils/otpUtils/verifyOTPCode";
import { generateJWT, generateRefreshToken } from "../utils/jwtUtils";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";

const signupService = async (userData: User) => {
  try {
    const { password, profileImage, username } = userData;
    const hashedPassword = await hashKey(password!);
    userData.password = hashedPassword;
    if (profileImage) {
      const image = await uploadToImageKit(profileImage, username);
      userData.profileImage = image.url;
    }
    const user = await prisma.user.create({ data: userData });
    return user;
  } catch (error) {
    throw error;
  }
};

const verifyOtpService = async (email: string, otp: string) => {
  try {
    const user = (await usersServices.getUserService(email)) as User;

    if (user.verified) {
      const error = globalError.create(
        "User already verified",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }

    const isMatch = await verifyOtpCode(email, otp);

    if (!isMatch) {
      const error = globalError.create(
        "Invalid OTP Code",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }

    const verifiedUser = await usersServices.updateUserService({
      userId: user.userId,
      verified: true,
    });

    const tokenPayload = {
      id: user.userId,
      email: user.email,
    };

    const token = generateJWT(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return { user: verifiedUser, token, refreshToken };
  } catch (error) {
    throw error;
  }
};

export default {
  signupService,
  verifyOtpService,
};
