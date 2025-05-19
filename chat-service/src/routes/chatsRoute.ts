import { Router } from "express";
import {
  addChatMember,
  createGroupChat,
  getChatMessages,
  getUserChats,
  muteMember,
} from "../controllers/chatsController";
import { verifyAccessToken } from "../middlewares";
import upload from "../config/multer";
import { validateRequestBody } from "../middlewares";
import {
  addMemberToChatSchema,
  createGroupChatSchema,
  muteMemberSchema,
} from "../schemas";

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

chatsRouter
  .route("/:chatId/members")
  .post(
    verifyAccessToken,
    validateRequestBody(addMemberToChatSchema),
    addChatMember
  );

chatsRouter
  .route("/:chatId/mute-member")
  .patch(verifyAccessToken, validateRequestBody(muteMemberSchema), muteMember);

export default chatsRouter;
