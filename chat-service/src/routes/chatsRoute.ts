import { Router } from "express";
import { getChatMessages, getUserChats } from "../controllers/chatsController";
import { verifyAccessToken } from "../middlewares";

const chatsRouter = Router();

chatsRouter.route("/").get(verifyAccessToken, getUserChats);
chatsRouter.route("/:chatId").get(verifyAccessToken, getChatMessages);

export default chatsRouter;
