import { Server } from "socket.io";
import http from "http";
import messagesServices from "./services/messagesServices";
import verifySocketAccessToken from "./middlewares/verifySocketAccessToken";
import chatsServices from "./services/chatsServices";
import globalError from "./utils/globalError";
import httpStatusText from "./utils/httpStatusText";

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
    console.log("user from inside socket", socket.data.user);
    // Join chat room
    socket.on("join_chat", async (chatId) => {
      try {
        const chat = await chatsServices.getChatService(chatId);
        if (chat.users.includes(socket.data.user._id)) {
          socket.join(chatId);
        } else {
          console.log(chat.users);
          const error = globalError.create(
            "You are not a member of this chat",
            400,
            httpStatusText.FAIL
          );
          // throw error;
        }
        // socket.join(chatId);

        console.log("Joined chat room:", chatId);
      } catch (error) {
        socket.emit("validation_error", error);
      }
    });

    // Handle sending messages
    socket.on("send_message", async (messageData) => {
      try {
        const { chatId, senderId, content } = messageData;
        const messageInfo = {
          chat: chatId,
          sender: senderId,
          message: content,
        };
        const savedMessage = await messagesServices.createMessage(
          chatId,
          messageInfo
        );
        console.log("📨 Message received:", savedMessage);
        io.to(chatId).emit("receive_message", savedMessage);
      } catch (error) {
        // next(error as ExtendedError);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

export default setupSocket;
