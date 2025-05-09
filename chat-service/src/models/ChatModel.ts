import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    type: { type: String, enum: ["private", "group"], required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    avatar: { type: Schema.Types.ObjectId, ref: "File" },
    name: { type: String },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
