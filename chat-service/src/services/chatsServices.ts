import { ChatModel } from "../models";
import { TChatData, TChatType } from "../types";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";

const checkChatTypeAndNumberOfUsers = (
  usersLength: number,
  chatType: TChatType
) => {
  if (chatType === "private" && usersLength !== 2) {
    const error = globalError.create(
      "You can only have two users in a private chat",
      400,
      httpStatusText.FAIL
    );
    throw error;
  }
};

const getChatService = async (chatId: string) => {
  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      const error = globalError.create(
        "Chat not found",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }
    return chat;
  } catch (error) {
    throw error;
  }
};

const createChatService = async (chatData: TChatData) => {
  try {
    const { chatType, users } = chatData;
    const chatPayload = {
      users,
      type: chatType,
    };

    checkChatTypeAndNumberOfUsers(users.length, chatType);

    const chat = await ChatModel.create(chatPayload);
    return chat;
  } catch (error) {
    throw error;
  }
};

export default { getChatService, createChatService };
