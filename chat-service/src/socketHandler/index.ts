import { Server } from "socket.io";
import http from "http";
import { verifySocketAccessToken } from "../middlewares";
import registerMessageHandler from "./registerMessageHandler";
import joinChatHandler from "./joinChatHandler";
import updateMessageHandler from "./updateMessageHandler";
import deleteMessageHandler from "./deleteMessageHandler";
import typingIndicatorHandler from "./typingIndicatorHandler";
import stopTypingIndicatorHandler from "./stopTypingIndicatorHandler";
import readByHandler from "./readByHandler";
import redisUtils from "../utils/redisUtils";

const setupSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(verifySocketAccessToken);

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);
    const userId = socket.data.user.userId;

    redisUtils.hset("online_users", userId, socket.id);
    socket.broadcast.emit("user-online", userId);

    joinChatHandler(socket);

    registerMessageHandler(socket, io);

    updateMessageHandler(socket, io);

    deleteMessageHandler(socket, io);

    typingIndicatorHandler(socket);

    stopTypingIndicatorHandler(socket);

    readByHandler(socket, io);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      redisUtils.hdel("online_users", userId);
    });
  });
};

export default setupSocket;
