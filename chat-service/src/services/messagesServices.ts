import { MessageModel } from "../models";
import {
  TChat,
  TCreateMessageInput,
  TMessage,
  TPaginationData,
} from "../types";
import GlobalError from "../utils/GlobalError";
import httpStatusText from "../utils/httpStatusText";
import paginationInfo from "../utils/paginationUtils/paginationInfo";
import chatsServices from "./chatsServices";
import filesServices from "./filesServices";

const createMessageFiles = async (messageData: TCreateMessageInput) => {
  try {
    if (messageData.files) {
      const files = await filesServices.createFileService(messageData.files);
      return files;
    }
  } catch (error) {
    throw error;
  }
};

const appendMessageToChat = async (chat: TChat, message: string) => {
  chat.messages.push(message);
  chat.lastMessage = message;
  await chat.save();
};

const getChatMessagesService = async (
  userId: string,
  chatId: string,
  paginationData: TPaginationData
) => {
  try {
    const chat = await chatsServices.getChatService(userId, chatId);

    const { limit, offset } = paginationData;

    const count = chat.messages.length;

    const messages = await MessageModel.find({ chat: chatId })
      .skip(offset)
      .limit(limit);

    const pagination = paginationInfo(count, offset, limit);
    return { messages, pagination };
  } catch (error) {
    throw error;
  }
};

const createMessageService = async (
  userId: string,
  messageData: TCreateMessageInput
) => {
  try {
    const { chat: chatId } = messageData;
    const chat = await chatsServices.getChatService(userId, chatId as string);

    const files = await createMessageFiles(messageData);

    const message = await MessageModel.create({ ...messageData, files });

    await appendMessageToChat(chat, message._id as string);
    return message.populate("files");
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
      const error = new GlobalError(
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

const deleteMessageService = async (userId: string, messageId: string) => {
  try {
    const message = await MessageModel.findByIdAndDelete(messageId);
    if (!message) {
      const error = new GlobalError(
        "Message not found",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }

    if (message.sender !== userId) {
      const error = new GlobalError(
        "You are not the sender of this message",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }

    return message;
  } catch (error) {
    throw error;
  }
};

const addReadByToMessage = async (userId: string, message: TMessage) => {
  try {
    message.readBy!.push(userId);
    await message.save();

    return message;
  } catch (error) {
    throw error;
  }
};

const getUnSeenMessagesService = async (userId: string, chatId: string) => {
  try {
    const messages = await MessageModel.find({
      chat: chatId,
      readBy: { $ne: userId },
    });

    return messages;
  } catch (error) {
    throw error;
  }
};

export default {
  getChatMessagesService,
  createMessageService,
  updateMessageService,
  deleteMessageService,
  addReadByToMessage,
  getUnSeenMessagesService,
};
