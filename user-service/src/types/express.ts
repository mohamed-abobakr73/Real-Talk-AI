import * as express from "express";
import TCurrentUser from "./TCurrentUser";
import { Profile } from "passport";

declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
      profile?: Profile;
      currentUser?: TCurrentUser;
    }
  }
}
