import { Router } from "express";
import {
  validateRequestBody,
  verifyAccessOrRefreshToken,
} from "../middlewares";
import sendConnectionSchema from "../schemas/sendConnectionSchema";
import {
  getReceivedConnections,
  getUserConnections,
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
  .route("/:connectionId")
  .patch(
    verifyAccessOrRefreshToken("access"),
    validateRequestBody(updateConnectionStatusSchema),
    updateConnectionStatus
  );
export default connectionsRouter;
