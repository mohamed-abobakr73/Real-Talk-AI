import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import httpStatusText from "../utils/httpStatusText";
import { chatsServices } from "../services";

const getUserChats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser!;

    const userChats = await chatsServices.getUserChatsService(user.userId);

    return res.status(200).json({ status: httpStatusText.SUCCESS, userChats });
  }
);

export { getUserChats };
