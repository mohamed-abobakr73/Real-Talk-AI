import { Server, Socket } from "socket.io";
import { validateSocketData } from "../middlewares";
import { messagesServices } from "../services";
import { deleteMessageSchema } from "../schemas";

const deleteMessageHandler = async (socket: Socket, io: Server) => {
  socket.on("delete_message", async (data, callback) => {
    try {
      const { validatedData, error } = validateSocketData(
        deleteMessageSchema,
        data
      );
      if (error) {
        callback(error);
      }

      const { messageId, chatId } = validatedData;

      const deletedMessage = await messagesServices.deleteMessageService(
        socket.data.user.userId,
        messageId
      );

      io.to(chatId).emit("delete_message", deletedMessage);
    } catch (error) {
      callback(error);
    }
  });
};

export default deleteMessageHandler;
