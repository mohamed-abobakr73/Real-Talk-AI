import { Schema, model } from "mongoose";
import { TChat } from "../types";

const chatSchema = new Schema<TChat>(
  {
    type: { type: String, enum: ["private", "group"], required: true },
    users: [{ type: String, required: true, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    avatar: { type: Schema.Types.ObjectId, ref: "File" }, // For group chats only, on private will be set on the fly, same applies for name
    name: { type: String },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
