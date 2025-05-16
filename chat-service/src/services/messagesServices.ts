import { MessageModel } from "../models";
import { TChat, TMessage } from "../types";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";
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

const updateMessageService = async (
  messageId: string,
  newMessageContent: string
) => {
  try {
    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      {
        message: newMessageContent,
      },
      { new: true }
    );
    if (!message) {
      const error = globalError.create(
        "Message not found",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }

    return message;
  } catch (error) {
    throw error;
  }
};

export default { getChatMessagesService, createMessage, updateMessageService };
