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
import sanitizeUser from "../utils/sanitizeUser";
import { TNewUser } from "../types";
import publishMessage from "../utils/rabbitmqUtils/publishMessage";

const sendUserDataToQueue = async (queueName: string, user: Partial<User>) => {
  try {
    const userData = {
      userId: user.userId,
      email: user.email,
      username: user.username,
    };

    const stringifiedUserData = JSON.stringify(userData);
    await publishMessage(queueName, stringifiedUserData);
  } catch (error) {
    throw error;
  }
};

const signupService = async (userData: TNewUser) => {
  try {
    const { password, profileImage, username } = userData;

    if (password) {
      const hashedPassword = await hashKey(password!);
      userData.password = hashedPassword;
    }

    if (profileImage) {
      // This is for the google auth signup, if the user have an image we don't upload to image kit and use the google image
      if (
        typeof profileImage === "string" &&
        profileImage.startsWith("https")
      ) {
        userData.profileImage = profileImage;
      } else {
        const image = await uploadToImageKit(profileImage, username!);
        userData.profileImage = image.url;
      }
    }

    const user = await prisma.user.create({ data: userData });
    const userSafeData = sanitizeUser(user);

    return userSafeData;
  } catch (error) {
    throw error;
  }
};

const verifyOtpService = async (email: string, otp: string) => {
  try {
    console.log(email);

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

    await sendUserDataToQueue("users", verifiedUser);

    return getTokensAfterRegistrationOrLogin(verifiedUser);
  } catch (error) {
    throw error;
  }
};

const loginService = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
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

    const userSafeData = sanitizeUser(user);
    return getTokensAfterRegistrationOrLogin(userSafeData);
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

const resetPasswordService = async (
  email: string,
  newPassword: string,
  otp: string
) => {
  try {
    const isMatch = await verifyOtpCode(email, otp);

    if (!isMatch) {
      const error = globalError.create(
        "Invalid OTP Code",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }

    const hashedPassword = await hashKey(newPassword);
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
      omit: { password: true },
    });

    return getTokensAfterRegistrationOrLogin(updatedUser);
  } catch (error) {
    throw error;
  }
};

const changeEmailService = async (oldEmail: string, newEmail: string) => {
  const updatedUser = await prisma.user.update({
    where: { email: oldEmail },
    data: { email: newEmail, verified: false },
  });

  return updatedUser;
};

export default {
  signupService,
  verifyOtpService,
  loginService,
  resendOtpService,
  resetPasswordService,
  changeEmailService,
};
