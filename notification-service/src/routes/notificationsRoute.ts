import { Router } from "express";
import { subscribeToNotifications } from "../controllers/notificationsController";
import { subscribeToNotificationsSchema } from "../schemas";
import { validateRequestBody } from "../middlewares";
import verifyAccessToken from "../middlewares/verifyAccessToken";

const notificationsRouter = Router();

notificationsRouter
  .route("/subscribe")
  .post(
    verifyAccessToken,
    validateRequestBody(subscribeToNotificationsSchema),
    subscribeToNotifications
  );

export default notificationsRouter;
