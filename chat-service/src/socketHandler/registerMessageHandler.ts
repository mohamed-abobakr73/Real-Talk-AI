import { Socket, Server } from "socket.io";
import messageSchema from "../schemas/messageSchema";
import messagesServices from "../services/messagesServices";
import validateSocketData from "../middlewares/validateSocketData";
import { chatsServices } from "../services";
import { streamUpload } from "../config/uploadFilesToCloudinary";

const refineUploadedFilesPayload = (userId: string, files: any) => {
  const uploadedFilesPayload = files.map((file: any) => {
    return {
      url: file.url,
      fileName: file.original_filename,
      type: file.format,
      size: file.bytes,
      uploadedBy: userId,
    };
  });
  return uploadedFilesPayload;
};

const uploadMessageFiles = async (userId: string, files: any) => {
  const uploadedFiles = await Promise.all(
    files.map(async (file: any) => {
      const buffer = Buffer.from(file.data);
      const uploadResult: any = await streamUpload(buffer);
      return uploadResult;
    })
  );

  const uploadedFilesPayload = refineUploadedFilesPayload(
    userId,
    uploadedFiles
  );

  return uploadedFilesPayload;
};

const registerMessageHandler = (socket: Socket, io: Server) => {
  socket.on("send_message", async (data, callback) => {
    try {
      const { validatedData, error } = validateSocketData(messageSchema, data);
      if (error) {
        callback(error);
      }
      const userId = socket.data.user.userId;

      if (validatedData.files) {
        validatedData.files = await uploadMessageFiles(
          userId,
          validatedData.files
        );
      }

      validatedData.sender = userId;

      await chatsServices.checkIfUserIsMutedService(data.chat, userId);

      const savedMessage = await messagesServices.createMessageService(
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
