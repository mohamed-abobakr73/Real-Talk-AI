import * as express from "express";
import TCurrentUser from "./TCurrentUser";

declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
      user?: TCurrentUser;
    }
  }
}
