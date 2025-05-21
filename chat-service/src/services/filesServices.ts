import { FileModel } from "../models";
import { TUploadedFile, TFile } from "../types";

const createFileService = async (files: TFile[]) => {
  try {
    console.log(files);
    const createdFiles = Promise.all(
      files.map(async (file) => {
        const filePayload = {
          url: file.url,
          fileName: file.fileName,
          type: file.type,
          size: file.size,
          uploadedBy: file.uploadedBy,
        };

        const createdFile = await FileModel.create(filePayload);

        return createdFile._id;
      })
    );

    return createdFiles;
  } catch (error) {
    throw error;
  }
};

export default {
  createFileService,
};
