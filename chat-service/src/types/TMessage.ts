import { Document, Schema } from "mongoose";

type TMessage = Document & {
  chat: Schema.Types.ObjectId | string;
  message: string;
  sender: string;
  files?: Schema.Types.ObjectId[] | string[];
  readBy?: string[];
};

export default TMessage;
