import { ChatModel } from "../models";
import {
  TChatType,
  TGroupChatData,
  TChatData,
  TChatUser,
  TChat,
} from "../types";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";
import uploadToImageKit from "../utils/uploadToImageKit";

const checkIfChatExits = (chat: TChat | undefined): chat is TChat => {
  try {
    if (!chat) {
      const error = globalError.create(
        "Chat not found",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const checkChatTypeAndNumberOfUsers = (
  usersLength: number,
  chatType: TChatType
) => {
  console.log(chatType, usersLength);
  if (chatType === "private" && usersLength > 2) {
    const error = globalError.create(
      "You can only have two users in a private chat",
      400,
      httpStatusText.FAIL
    );
    throw error;
  }
};

const checkIfUserIsPartOfChat = (users: TChatUser[], userId: string) => {
  const user = users.find((user) => user.user === userId);
  if (!user) {
    const error = globalError.create(
      "You are not a member of this chat",
      400,
      httpStatusText.FAIL
    );
    throw error;
  }
  return user;
};

const checkUserRole = (user: TChatUser, role: "admin" | "user") => {
  if (user.role !== role) {
    const error = globalError.create(
      "You are not authorized to perform this action",
      400,
      httpStatusText.FAIL
    );
    throw error;
  }
};

const checkIfUserAlreadyExistInChat = (
  users: TChatUser[],
  memberId: string
) => {
  const user = users.find((user) => user.user === memberId);
  if (user) {
    const error = globalError.create(
      "User already exists in chat",
      400,
      httpStatusText.FAIL
    );
    throw error;
  }
};

const getUserChatsService = async (userId: string) => {
  try {
    const chats = await ChatModel.find({
      users: { $elemMatch: { user: userId } },
    }).populate("lastMessage");

    return chats;
  } catch (error) {
    throw error;
  }
};

const getChatService = async (userId: string, chatId: string) => {
  try {
    const chat = (await ChatModel.findById(chatId)) as TChat;

    checkIfChatExits(chat);
    checkIfUserIsPartOfChat(chat.users, userId);

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

const createGroupChatService = async (
  userId: string,
  chatData: TGroupChatData
) => {
  try {
    const { avatar, name } = chatData;
    const chatPayload = {
      type: "group",
      users: [{ user: userId, role: "admin" }],
      avatar,
      name,
    };

    if (avatar) {
      const image = await uploadToImageKit(avatar, name);
      chatPayload.avatar = image.url;
    }

    const chat = await ChatModel.create(chatPayload);
    return chat;
  } catch (error) {
    throw error;
  }
};

const addChatMemberService = async (
  userId: string,
  userData: { chatId: string; memberId: string; role: "admin" | "user" }
) => {
  try {
    const { chatId, memberId, role } = userData;

    const chat = (await ChatModel.findById(chatId)) as TChat;

    checkIfChatExits(chat);

    checkChatTypeAndNumberOfUsers(chat.users.length, chat.type);

    const adminUser = checkIfUserIsPartOfChat(chat.users, userId);

    checkUserRole(adminUser, "admin");

    checkIfUserAlreadyExistInChat(chat.users, memberId);

    chat.users.push({ user: memberId, role });
    await chat!.save();
    return chat;
  } catch (error) {
    throw error;
  }
};

export default {
  getUserChatsService,
  getChatService,
  createChatService,
  checkIfUserIsPartOfChat,
  createGroupChatService,
  addChatMemberService,
};
