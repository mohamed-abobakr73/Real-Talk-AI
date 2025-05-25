import { TMessage } from "../../types";
import publishMessage from "./publishMessage";

const sendMessageToQueue = async (queue: string, message: any) => {
  try {
    const stringifiedMessageData = JSON.stringify(message);

    await publishMessage(queue, stringifiedMessageData);
  } catch (error) {
    throw error;
  }
};

export default sendMessageToQueue;
