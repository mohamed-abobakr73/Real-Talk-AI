import { MessageModel } from "../models";
import { TChat, TMessage } from "../types";
import chatsServices from "./chatsServices";

const appendMessageToChat = async (chat: TChat, message: string) => {
  chat.messages.push(message);
  await chat.save();
};

const createMessage = async (messageData: TMessage) => {
  try {
    const { chat: chatId } = messageData;
    const chat = await chatsServices.getChatService(chatId as string);

    const message = await MessageModel.create(messageData);
    await appendMessageToChat(chat, message._id as string);
    return message;
  } catch (error) {
    throw error;
  }
};

export default { createMessage };
