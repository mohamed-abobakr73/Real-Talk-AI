import { Schema, model } from "mongoose";
import { TMessage } from "../types";

const messageSchema = new Schema<TMessage>(
  {
    chat: { type: Schema.Types.ObjectId, required: true, ref: "Chat" },
    message: { type: String, required: true },
    files: [{ type: Schema.Types.ObjectId, ref: "File" }],
    sender: { type: String, ref: "User", required: true },
    readBy: [{ type: String, ref: "User" }],
  },
  { timestamps: true }
);

export default model("Message", messageSchema);
