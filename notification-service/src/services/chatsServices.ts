import ChatModel from "../models/ChatModel";
import { TChat } from "../types";

const createChatService = async (chatData: TChat) => {
  try {
    console.log(chatData);
    const chat = await ChatModel.create(chatData);
    return chat;
  } catch (error) {
    throw error;
  }
};

export default {
  createChatService,
};
