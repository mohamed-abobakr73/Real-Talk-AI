import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares";
import notificationsServices from "../services/notificationsServices";

const subscribeToNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const subscription = req.validatedData;

    res.status(201).json({ status: "success" });

    const pushSubscription =
      await notificationsServices.savePushSubscriptionDataService(subscription);

    await notificationsServices.sendNotificationService(subscription, {
      title: "test title",
    });
  }
);

export { subscribeToNotifications };
