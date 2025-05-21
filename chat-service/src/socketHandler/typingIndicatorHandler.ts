import { Socket, Server } from "socket.io";
import { validateSocketData } from "../middlewares";
import { chatIdSchema } from "../schemas";

const typingIndicatorHandler = async (socket: Socket) => {
  socket.on("typing_indicator", async (data, callback) => {
    try {
      const { validatedData, error } = validateSocketData(chatIdSchema, data);
      if (error) {
        callback(error);
      }

      const { chatId } = validatedData;

      socket.broadcast
        .to(chatId)
        .emit("typing_indicator", socket.data.user.username);
    } catch (error) {
      callback(error);
    }
  });
};

export default typingIndicatorHandler;
