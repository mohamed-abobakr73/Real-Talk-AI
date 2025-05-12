import { User } from "../../generated/prisma";
import publishMessage from "./publishMessage";

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

export default sendUserDataToQueue;
