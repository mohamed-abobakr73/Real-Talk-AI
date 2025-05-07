import { Router } from "express";
import {
  validateRequestBody,
  verifyAccessOrRefreshToken,
} from "../middlewares";
import sendConnectionSchema from "../schemas/sendConnectionSchema";
import {
  getRecievedConnections,
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
  .get(verifyAccessOrRefreshToken("access"), getRecievedConnections);

connectionsRouter
  .route("/:connectionId")
  .patch(
    verifyAccessOrRefreshToken("access"),
    validateRequestBody(updateConnectionStatusSchema),
    updateConnectionStatus
  );
export default connectionsRouter;
