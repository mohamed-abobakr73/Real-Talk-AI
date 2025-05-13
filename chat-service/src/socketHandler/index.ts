import { ExtendedError, Server } from "socket.io";
import http from "http";
import verifySocketAccessToken from "../middlewares/verifySocketAccessToken";
import receiveAndSaveChatMessage from "../utils/receiveAndSaveChatMessage";
import registerMessageHandler from "./registerMessageHandler";

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
    socket.on("join_chat", async (chatId) => {
      // const chat = await chatsServices.getChatService(chatId);
      // chatsServices.checkIfUserIsPartOfChat(
      //   chat.users,
      //   socket.data.user.userId
      // );
      socket.join(chatId);
      console.log("Joined chat room:", chatId);
    });

    registerMessageHandler(socket, io);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

export default setupSocket;
