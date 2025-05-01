import prisma from "../config/prismaClient";
import type { User } from "../generated/prisma";
import uploadToImageKit from "../utils/uploadToImageKit";
import hashKey from "../utils/hashingUtils/hashKey";

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

export default {
  signupService,
};
