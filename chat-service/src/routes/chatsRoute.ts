import { Router } from "express";
import { getUserChats } from "../controllers/chatsController";
import { verifyAccessToken } from "../middlewares";

const chatsRouter = Router();

chatsRouter.route("/").get(verifyAccessToken, getUserChats);

export default chatsRouter;
