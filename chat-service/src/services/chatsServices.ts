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

const createChat = async (chatData: TChatData) => {
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

export default { createChat };
