import ChatModel from "../models/ChatModel";
import { TChat } from "../types";

const getChatByIdService = async (chatId: string) => {
  try {
    const chat = await ChatModel.findOne({ chatId });
    return chat;
  } catch (error) {
    throw error;
  }
};
const createChatService = async (chatData: TChat) => {
  try {
    const chat = await ChatModel.create(chatData);
    return chat;
  } catch (error) {
    throw error;
  }
};

export default {
  getChatByIdService,
  createChatService,
};
