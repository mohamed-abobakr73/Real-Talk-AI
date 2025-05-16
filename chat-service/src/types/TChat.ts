import { Document, Schema } from "mongoose";
import TChatUser from "./TChatUser";

type TChat = Document & {
  type: "private" | "group";
  users: TChatUser[];
  messages: string[];
  avatar?: string;
  name?: string;
  lastMessage?: string;
};

export default TChat;
