import { Document, Schema } from "mongoose";

type TMessage = Document & {
  chat: Schema.Types.ObjectId | string;
  message: string;
  sender: string;
  files?: string[];
  readBy?: string[];
};

export default TMessage;
