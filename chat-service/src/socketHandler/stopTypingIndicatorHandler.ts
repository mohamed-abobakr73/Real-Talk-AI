import { Socket } from "socket.io";
import { validateSocketData } from "../middlewares";
import { chatIdSchema } from "../schemas";

const stopTypingIndicatorHandler = async (socket: Socket) => {
  socket.on("stop_typing_indicator", async (data, callback) => {
    try {
      const { validatedData, error } = validateSocketData(chatIdSchema, data);
      if (error) {
        callback(error);
      }

      const { chatId } = validatedData;

      socket.broadcast.to(chatId).emit("stop_typing_indicator", validatedData);
    } catch (error) {
      callback(error);
    }
  });
};

export default stopTypingIndicatorHandler;
