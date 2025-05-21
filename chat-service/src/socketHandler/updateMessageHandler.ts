import { Socket, Server } from "socket.io";
import { messagesServices } from "../services";
import updateMessageSchema from "../schemas/updateMessageSchema";
import { validateSocketData } from "../middlewares";

const updateMessageHandler = (socket: Socket, io: Server) => {
  socket.on("update_message", async (data, callback) => {
    try {
      const { validatedData, error } = validateSocketData(
        updateMessageSchema,
        data
      );
      if (error) {
        callback(error);
      }

      const { messageId, newMessageContent } = validatedData;

      const updatedMessage = await messagesServices.updateMessageService(
        messageId,
        newMessageContent
      );

      console.log(updatedMessage);

      io.to(validatedData.chatId).emit("update_message", updatedMessage);
    } catch (error) {
      callback(error);
    }
  });
};

export default updateMessageHandler;
