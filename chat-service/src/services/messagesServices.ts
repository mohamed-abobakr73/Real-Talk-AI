import { MessageModel } from "../models";
import chatsServices from "./chatsServices";

const appendMessageToChat = async (chat: any, message: any) => {
  chat.messages.push(message);
  await chat.save();
};

const createMessage = async (chatId: string, messageData: any) => {
  try {
    const chat = await chatsServices.getChatService(chatId);
    const message = await MessageModel.create(messageData);
    await appendMessageToChat(chat, message);
    return message;
  } catch (error) {
    throw error;
  }
};

export default { createMessage };
