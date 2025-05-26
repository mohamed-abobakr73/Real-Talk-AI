import { Router } from "express";
import { subscribeToNotifications } from "../controllers/notificationsController";
import { subscribeToNotificationsSchema } from "../schemas";
import { validateRequestBody } from "../middlewares";

const notificationsRouter = Router();

notificationsRouter
  .route("/subscribe")
  .post(
    validateRequestBody(subscribeToNotificationsSchema),
    subscribeToNotifications
  );

export default notificationsRouter;
