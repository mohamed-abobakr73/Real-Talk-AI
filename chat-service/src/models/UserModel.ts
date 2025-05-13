import { Schema, model } from "mongoose";
import { TUser } from "../types";

const userSchema = new Schema<TUser>({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
});

export default model("User", userSchema);
