import { ChatModel } from "../models";
import { TChatData } from "../types";

const createChat = async (chatData: TChatData) => {
  try {
    const { chatType, users } = chatData;
    const chatPayload = {
      users,
      type: chatType,
    };
    const chat = await ChatModel.create(chatPayload);
    return chat;
  } catch (error) {
    throw error;
  }
};

export default { createChat };
