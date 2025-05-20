import { Server } from "socket.io";
import http from "http";
import verifySocketAccessToken from "../middlewares/verifySocketAccessToken";
import registerMessageHandler from "./registerMessageHandler";
import joinChatHandler from "./joinChatHandler";
import updateMessageHandler from "./updateMessageHandler";
import deleteMessageHandler from "./deleteMessageHandler";

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

    // // Join chat room
    joinChatHandler(socket);

    registerMessageHandler(socket, io);

    updateMessageHandler(socket, io);

    deleteMessageHandler(socket, io);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

export default setupSocket;
