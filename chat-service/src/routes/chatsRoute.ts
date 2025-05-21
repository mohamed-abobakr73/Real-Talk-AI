import { Router } from "express";
import {
  addChatMember,
  createGroupChat,
  getChatMessages,
  getUserChats,
  muteMember,
  kickMember,
  unMuteMember,
} from "../controllers/chatsController";
import { verifyAccessToken } from "../middlewares";
import upload from "../config/multer";
import { validateRequestBody } from "../middlewares";
import {
  addMemberToChatSchema,
  createGroupChatSchema,
  kickMemberSchema,
  muteMemberSchema,
  unMuteMemberSchema,
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

chatsRouter
  .route("/:chatId/mute-member")
  .delete(
    verifyAccessToken,
    validateRequestBody(unMuteMemberSchema),
    unMuteMember
  );

chatsRouter
  .route("/:chatId/kick-member")
  .patch(verifyAccessToken, validateRequestBody(kickMemberSchema), kickMember);

export default chatsRouter;
