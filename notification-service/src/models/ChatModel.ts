import { Schema, model } from "mongoose";
import { TChat } from "../types";

const chatSchema = new Schema<TChat>(
  {
    chatId: { type: String, required: true },
    users: [{ userId: { type: String, required: true } }],
    avatar: { type: String }, // For group chats only, on private will be set on the fly, same applies for name
    name: { type: String },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
