import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares";
import notificationsServices from "../services/notificationsServices";

const subscribeToNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const subscription = req.validatedData;

    subscription.userId = req.currentUser!.userId;

    const pushSubscription =
      await notificationsServices.savePushSubscriptionDataService(subscription);

    await notificationsServices.sendNotificationService(subscription, {
      title: "test title",
    });
    res.status(201).json({ status: "success" });
  }
);

export { subscribeToNotifications };
