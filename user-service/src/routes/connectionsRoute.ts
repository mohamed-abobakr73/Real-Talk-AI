import { Router } from "express";
import {
  validateRequestBody,
  verifyAccessOrRefreshToken,
} from "../middlewares";
import sendConnectionSchema from "../schemas/sendConnectionSchema";
import {
  getRecievedConnections,
  sendConnection,
} from "../controllers/connectionsController";

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

export default connectionsRouter;
