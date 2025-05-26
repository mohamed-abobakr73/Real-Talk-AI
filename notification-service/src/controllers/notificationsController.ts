import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares";
import notificationsServices from "../services/notificationsServices";

const subscribeToNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const subscription = req.validatedData;
    console.log(subscription);
    res.status(201).json({ status: "success" });
    await notificationsServices.sendNotificationService(subscription, {
      title: "test title",
    });
  }
);

export { subscribeToNotifications };
