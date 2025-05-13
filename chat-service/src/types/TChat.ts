import { Document, Schema } from "mongoose";

type TChat = Document & {
  type: "private" | "group";
  users: string[];
  messages: string[];
  avatar?: string;
  name?: string;
  lastMessage?: string;
};

export default TChat;
