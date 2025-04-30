import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";

const signup = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return res.json({ name: "test" });
  }
);

export { signup };
