import ChatModel from "../models/ChatModel";
import { TChat } from "../types";

const createChatService = async (chatData: TChat) => {
  try {
    const chat = await ChatModel.create(chatData);
    return chat;
  } catch (error) {
    throw error;
  }
};

export default {
  createChatService,
};
