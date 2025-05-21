import { Document } from "mongoose";

type TUser = Document & {
  _id: string;
  username: string;
  email: string;
};

export default TUser;
