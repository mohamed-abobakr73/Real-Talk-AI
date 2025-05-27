import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import httpStatusText from "../utils/httpStatusText";
import { chatsServices, messagesServices } from "../services";
import paginationParams from "../utils/paginationUtils/paginationParams";
import GlobalError from "../utils/GlobalError";

const getUserChats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser!;

    const paginationData = paginationParams(req.query);

    const { chats: userChats, pagination } =
      await chatsServices.getUserChatsService(user.userId, paginationData);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { userChats, pagination },
    });
  }
);

const getChatMessages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { userId } = req.currentUser!;

    if (!chatId) {
      const error = new GlobalError(
        "Chat id is required",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    const paginationData = paginationParams(req.query);

    const { messages, pagination } =
      await messagesServices.getChatMessagesService(
        userId,
        chatId,
        paginationData
      );
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { messages, pagination } });
  }
);

const createGroupChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.currentUser!;
    const validatedRequestBody = req.validatedData;
    if (req.file) {
      validatedRequestBody.avatar = req.file.buffer;
    }
    const chat = await chatsServices.createGroupChatService(
      userId,
      validatedRequestBody
    );
    return res.status(200).json({ status: httpStatusText.SUCCESS, chat });
  }
);

const addChatMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { userId } = req.currentUser!;
    const validatedRequestBody = req.validatedData;
    validatedRequestBody.chatId = chatId;

    const chat = await chatsServices.addChatMemberService(
      userId,
      validatedRequestBody
    );

    return res.status(200).json({ status: httpStatusText.SUCCESS, chat });
  }
);

const muteMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { userId } = req.currentUser!;
    const validatedRequestBody = req.validatedData;
    validatedRequestBody.chatId = chatId;

    const chat = await chatsServices.muteChatMemberService(
      userId,
      validatedRequestBody
    );

    return res.status(200).json({ status: httpStatusText.SUCCESS, chat });
  }
);

const unMuteMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { userId } = req.currentUser!;
    const validatedRequestBody = req.validatedData;
    validatedRequestBody.chatId = chatId;

    const chat = await chatsServices.unMuteChatMemberService(
      userId,
      validatedRequestBody
    );

    return res.status(200).json({ status: httpStatusText.SUCCESS, chat });
  }
);

const kickMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { userId } = req.currentUser!;
    const validatedRequestBody = req.validatedData;
    validatedRequestBody.chatId = chatId;

    const chat = await chatsServices.kickMemberService(
      userId,
      validatedRequestBody
    );

    return res.status(200).json({ status: httpStatusText.SUCCESS, chat });
  }
);

export {
  getUserChats,
  getChatMessages,
  createGroupChat,
  addChatMember,
  muteMember,
  unMuteMember,
  kickMember,
};
