import prisma from "../config/prismaClient";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";

const getUserService = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
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
export default { getUserService };
