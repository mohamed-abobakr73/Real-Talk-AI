import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";

const getAiResponse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export { getAiResponse };
