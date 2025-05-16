import { Socket, Server } from "socket.io";
import messageSchema from "../schemas/messageSchema";
import messagesServices from "../services/messagesServices";
import validateSocketData from "../middlewares/validateSocketData";

const registerMessageHandler = (socket: Socket, io: Server) => {
  socket.on("send_message", async (data, callback) => {
    try {
      const { validatedData, error } = validateSocketData(messageSchema, data);
      if (error) {
        callback(error);
      }

      validatedData.sender = socket.data.user.userId;

      const savedMessage = await messagesServices.createMessage(
        socket.data.user.userId,
        validatedData
      );

      io.to(validatedData.chat).emit("receive_message", savedMessage);
    } catch (error) {
      callback(error);
    }
  });
};

export default registerMessageHandler;
