import prisma from "../config/prismaClient";
import type { User } from "../generated/prisma";
import uploadToImageKit from "../utils/uploadToImageKit";
import hashKey from "../utils/hashingUtils/hashKey";
import usersServices from "./usersServices";
import verifyOtpCode from "../utils/otpUtils/verifyOTPCode";
import { getTokensAfterRegistrationOrLogin } from "../utils/jwtUtils";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";
import compareHashedValues from "../utils/hashingUtils/compareHashedValues";

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

    return getTokensAfterRegistrationOrLogin(verifiedUser);
  } catch (error) {
    throw error;
  }
};

const loginService = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const error = globalError.create(
        "Invalid credentials",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }

    if (!user.verified) {
      const error = globalError.create(
        "User is not verified, please verify your account first then try to login",
        401,
        httpStatusText.FAIL
      );
      throw error;
    }

    const passwordMatch = await compareHashedValues(password, user.password!);
    if (!passwordMatch) {
      const error = globalError.create(
        "Invalid credentials",
        401,
        httpStatusText.FAIL
      );
      throw error;
    }

    return getTokensAfterRegistrationOrLogin(user);
  } catch (error) {
    throw error;
  }
};

const resendOtpService = async (email: string) => {
  try {
    const user = await usersServices.getUserService(email);
    if (user.verified) {
      const error = globalError.create(
        "User already verified",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export default {
  signupService,
  verifyOtpService,
  loginService,
  resendOtpService,
};
