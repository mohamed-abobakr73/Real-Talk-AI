import { Router } from "express";
import {
  validateRequestBody,
  verifyAccessOrRefreshToken,
} from "../middlewares";
import sendConnectionSchema from "../schemas/sendConnectionSchema";
import {
  getReceivedConnections,
  getUserConnections,
  getUserSentConnections,
  sendConnection,
  updateConnectionStatus,
} from "../controllers/connectionsController";
import updateConnectionStatusSchema from "../schemas/updateConnectionStatusSchema";

const connectionsRouter = Router();

connectionsRouter
  .route("/")
  .post(
    verifyAccessOrRefreshToken("access"),
    validateRequestBody(sendConnectionSchema),
    sendConnection
  );

connectionsRouter
  .route("/")
  .get(verifyAccessOrRefreshToken("access"), getUserConnections);

connectionsRouter
  .route("/received-connections")
  .get(verifyAccessOrRefreshToken("access"), getReceivedConnections);

connectionsRouter
  .route("/sent-connections")
  .get(verifyAccessOrRefreshToken("access"), getUserSentConnections);

connectionsRouter
  .route("/:connectionId")
  .patch(
    verifyAccessOrRefreshToken("access"),
    validateRequestBody(updateConnectionStatusSchema),
    updateConnectionStatus
  );

export default connectionsRouter;
