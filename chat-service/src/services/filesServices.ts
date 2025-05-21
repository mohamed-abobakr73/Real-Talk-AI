import { FileModel } from "../models";
import { TUploadedFile } from "../types";
const createFileService = async (file: TUploadedFile) => {
  try {
    const filePayload = {
      url: file.path,
      fileName: file.originalname,
      type: file.mimetype,
      size: file.size,
    };

    const createdFile = await FileModel.create(filePayload);
    return createdFile;
  } catch (error) {
    throw error;
  }
};

export default {
  createFileService,
};
