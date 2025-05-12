import { ChatModel } from "../models";
import { TChatData } from "../types";

const createChat = async (chatData: TChatData) => {
  try {
    const { chatType, senderId, receiverId } = chatData;
    const chatPayload = {
      users: [senderId, receiverId],
      type: chatType,
    };
    const chat = await ChatModel.create(chatPayload);
    return chat;
  } catch (error) {
    throw error;
  }
};

export default { createChat };
