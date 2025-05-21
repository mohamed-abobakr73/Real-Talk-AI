import { Socket, Server } from "socket.io";
import { validateSocketData } from "../middlewares";
import { chatIdSchema } from "../schemas";
import { messagesServices } from "../services";

const readByHandler = async (socket: Socket, io: Server) => {
  socket.on("read_by", async (data, callback) => {
    try {
      const { validatedData, error } = validateSocketData(chatIdSchema, data);
      if (error) {
        console.log("validatoin error");
        callback(error);
      }
      const userId = socket.data.user.userId;
      const { chatId } = validatedData;

      const unSeenMessages = await messagesServices.getUnSeenMessagesService(
        userId,
        chatId
      );

      for (const message of unSeenMessages) {
        const readMessage = await messagesServices.addReadByToMessage(
          userId,
          message
        );
      }

      io.to(chatId).emit("read_by", {
        chatId,
        userId,
        messageIds: unSeenMessages.map((message) => message._id),
      });
    } catch (error) {
      callback(error);
    }
  });
};

export default readByHandler;
