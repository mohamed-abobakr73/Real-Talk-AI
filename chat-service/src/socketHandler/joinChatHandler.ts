import { Socket } from "socket.io";
import chatsServices from "../services/chatsServices";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";

const joinChatHandler = (socket: Socket) => {
  socket.on("join_chat", async (chatId, callback) => {
    try {
      if (!chatId) {
        const error = globalError.create(
          "Chat id not found",
          404,
          httpStatusText.NOT_FOUND
        );
        callback(error);
      }

      const chat = await chatsServices.getChatService(
        socket.data.user.userId,
        chatId
      );

      socket.join(chatId);
      console.log("Joined chat room:", chatId);
    } catch (error) {
      callback(error);
    }
  });
};

export default joinChatHandler;
