import { MessageModel } from "../models";

const createMessage = async (chatId: string, messageData: any) => {
  try {
    const message = await MessageModel.create(messageData);
    return message;
  } catch (error) {
    throw error;
  }
};

export default { createMessage };
