import { ChatModel } from "../models";
import {
  TChatType,
  TGroupChatData,
  TChatData,
  TChatUser,
  TChat,
  TPaginationData,
} from "../types";
import GlobalError from "../utils/GlobalError";
import httpStatusText from "../utils/httpStatusText";
import paginationInfo from "../utils/paginationUtils/paginationInfo";
import sendMessageToQueue from "../utils/rabbitmqUtils/sendMessageToQueue";
import redisUtils from "../utils/redisUtils";
import uploadToImageKit from "../utils/uploadToImageKit";

const checkIfChatExits = (chat: TChat | undefined): chat is TChat => {
  try {
    if (!chat) {
      const error = new GlobalError(
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
  if (chatType === "private" && usersLength > 2) {
    const error = new GlobalError(
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
    const error = new GlobalError(
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
    const error = new GlobalError(
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
    const error = new GlobalError(
      "User already exists in chat",
      400,
      httpStatusText.FAIL
    );
    throw error;
  }
};

const sendChatToQueue = async (chat: TChat) => {
  await sendMessageToQueue("chatCreated", {
    chatId: chat._id,
    users: chat.users.map((user) => {
      return { userId: user.user };
    }),
    name: chat.name ? chat.name : "",
    avatar: chat.avatar ? chat.avatar : "",
  });
};

const getUserChatsService = async (
  userId: string,
  paginationData: TPaginationData
) => {
  try {
    const { limit, offset } = paginationData;

    const count = await ChatModel.countDocuments({
      users: { $elemMatch: { user: userId } },
    });

    const chats = await ChatModel.find({
      users: { $elemMatch: { user: userId } },
    })
      .populate("lastMessage")
      .skip(offset)
      .limit(limit);

    const pagination = paginationInfo(count, chats.length, limit);
    return { chats, pagination };
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
    await sendChatToQueue(chat);
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
    await sendChatToQueue(chat);
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

const muteChatMemberService = async (
  userId: string,
  muteData: { chatId: string; memberToMuteId: string; muteDate: Date }
) => {
  try {
    const { chatId, memberToMuteId, muteDate } = muteData;

    const chat = (await ChatModel.findById(chatId)) as TChat;
    checkIfChatExits(chat);

    const adminUser = checkIfUserIsPartOfChat(chat.users, userId);
    checkIfUserIsPartOfChat(chat.users, memberToMuteId);

    checkUserRole(adminUser, "admin");

    const memberToMute = chat.users.find(
      (user) => user.user === memberToMuteId
    );

    memberToMute!.mutedUntil = muteDate;
    await chat.save();

    return chat;
  } catch (error) {
    throw error;
  }
};

const checkIfUserIsMutedService = async (chatId: string, userId: string) => {
  try {
    const cacheKey = `${chatId}-${userId}`;
    const cachedMuteUntil = await redisUtils.get(cacheKey);

    if (cachedMuteUntil && cachedMuteUntil > Date.now()) {
      const error = new GlobalError("You are muted", 400, httpStatusText.FAIL);
      throw error;
    }

    const chat = (await ChatModel.findById(chatId, {
      users: { $elemMatch: { user: userId } },
    }).lean()) as TChat;

    checkIfChatExits(chat);

    checkIfUserIsPartOfChat(chat.users, userId);

    const userInChat = chat.users[0];

    if (userInChat.mutedUntil && userInChat.mutedUntil.getTime() > Date.now()) {
      const userMutedUntil = userInChat.mutedUntil.getTime();

      await redisUtils.set(
        cacheKey,
        userMutedUntil.toString(),
        userMutedUntil - Date.now()
      );

      const error = new GlobalError("You are muted", 400, httpStatusText.FAIL);
      throw error;
    }

    await redisUtils.delete(cacheKey);
  } catch (error) {
    throw error;
  }
};

const unMuteChatMemberService = async (
  userId: string,
  mutedUserData: { chatId: string; memberToUnMuteId: string }
) => {
  try {
    const { chatId, memberToUnMuteId: memberId } = mutedUserData;
    const cacheKey = `${chatId}-${memberId}`;
    const chat = (await ChatModel.findById(chatId)) as TChat;
    checkIfChatExits(chat);

    const adminUser = checkIfUserIsPartOfChat(chat.users, userId);
    const mutedMember = checkIfUserIsPartOfChat(chat.users, memberId);

    checkUserRole(adminUser, "admin");

    mutedMember.mutedUntil = null;

    redisUtils.delete(cacheKey);

    await chat.save();
    return chat;
  } catch (error) {
    throw error;
  }
};

const kickMemberService = async (
  userId: string,
  kickData: { chatId: string; memberToKickId: string }
) => {
  try {
    const { chatId, memberToKickId } = kickData;

    const chat = (await ChatModel.findById(chatId)) as TChat;
    checkIfChatExits(chat);

    const adminUser = checkIfUserIsPartOfChat(chat.users, userId);
    checkIfUserIsPartOfChat(chat.users, memberToKickId);

    checkUserRole(adminUser, "admin");

    chat.users = chat.users.filter((user) => user.user !== memberToKickId);
    await chat.save();
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
  muteChatMemberService,
  unMuteChatMemberService,
  checkIfUserIsMutedService,
  kickMemberService,
};
