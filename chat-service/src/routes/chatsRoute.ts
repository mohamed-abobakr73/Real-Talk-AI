import { Router } from "express";
import {
  createGroupChat,
  getChatMessages,
  getUserChats,
} from "../controllers/chatsController";
import { verifyAccessToken } from "../middlewares";
import upload from "../config/multer";
import { validateRequestBody } from "../middlewares";
import { createGroupChatSchema } from "../schemas";

const chatsRouter = Router();

chatsRouter.route("/").get(verifyAccessToken, getUserChats);
chatsRouter
  .route("/")
  .post(
    verifyAccessToken,
    upload.single("avatar"),
    validateRequestBody(createGroupChatSchema),
    createGroupChat
  );
chatsRouter.route("/:chatId").get(verifyAccessToken, getChatMessages);

export default chatsRouter;
