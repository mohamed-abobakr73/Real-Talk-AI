import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../middlewares";

const subscribeToNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export { subscribeToNotifications };
