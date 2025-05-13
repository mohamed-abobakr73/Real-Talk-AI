import { Server } from "socket.io";
import http from "http";
import verifySocketAccessToken from "./middlewares/verifySocketAccessToken";
import chatsServices from "./services/chatsServices";
import receiveAndSaveChatMessage from "./utils/receiveAndSaveChatMessage";

const setupSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const user = await verifySocketAccessToken(socket, next);
    next();
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // Join chat room
    socket.on("join_chat", async (chatId) => {
      try {
        const chat = await chatsServices.getChatService(chatId);
        chatsServices.checkIfUserIsPartOfChat(
          chat.users,
          socket.data.user.userId
        );
        socket.join(chatId);
        console.log("Joined chat room:", chatId);
      } catch (error) {
        socket.emit("validation_error", error);
      }
    });

    // Handle sending messages
    socket.on("send_message", async (messageData) => {
      try {
        const message = await receiveAndSaveChatMessage(messageData);
        io.to(messageData.chat).emit("receive_message", message);
      } catch (error) {
        io.emit("validation_error", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

export default setupSocket;
