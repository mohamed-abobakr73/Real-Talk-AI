import prisma from "../config/prismaClient";
import { User } from "../generated/prisma";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";
import uploadToImageKit from "../utils/uploadToImageKit";

const getUserService = async (userId: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { userId },
      omit: { password: true },
    });

    if (!user) {
      const error = globalError.create(
        "User not found",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserService = async (fields: Partial<User>) => {
  try {
    const { userId, email, password, ...rest } = fields;
    const { profileImage } = rest;

    if (profileImage) {
      const image = await uploadToImageKit(profileImage, rest.username || "");
      rest.profileImage = image.url;
    }

    const user = await prisma.user.update({
      where: { userId: userId },
      data: rest,
      omit: { password: true },
    });

    if (!user) {
      const error = globalError.create(
        "User not found",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }
    return user;
  } catch (error) {
    throw error;
  }
};
export default { getUserService, updateUserService };
