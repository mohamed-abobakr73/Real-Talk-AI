import { UserModel } from "../models";
import { TUser } from "../types";

const createUser = async (user: TUser) => {
  try {
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    const createdUser = await UserModel.create(userData);
    return createdUser;
  } catch (error) {
    throw error;
  }
};

export default { createUser };
