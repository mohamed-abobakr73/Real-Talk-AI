import { MessageModel } from "../models";
import { TChat, TMessage } from "../types";
import chatsServices from "./chatsServices";

const appendMessageToChat = async (chat: TChat, message: string) => {
  chat.messages.push(message);
  chat.lastMessage = message;
  await chat.save();
};

const getChatMessagesService = async (userId: string, chatId: string) => {
  try {
    const chat = await chatsServices.getChatService(userId, chatId);

    const messages = await MessageModel.find({ chat: chatId });
    return messages;
  } catch (error) {
    throw error;
  }
};

const createMessage = async (userId: string, messageData: TMessage) => {
  try {
    const { chat: chatId } = messageData;
    const chat = await chatsServices.getChatService(userId, chatId as string);

    const message = await MessageModel.create(messageData);
    await appendMessageToChat(chat, message._id as string);
    return message;
  } catch (error) {
    throw error;
  }
};

export default { getChatMessagesService, createMessage };
