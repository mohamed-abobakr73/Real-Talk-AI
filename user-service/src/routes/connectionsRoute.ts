import { Router } from "express";
import {
  validateRequestBody,
  verifyAccessOrRefreshToken,
} from "../middlewares";
import sendConnectionSchema from "../schemas/sendConnectionSchema";
import { sendConnection } from "../controllers/connectionsController";

const connectionsRouter = Router();

connectionsRouter
  .route("/")
  .post(
    verifyAccessOrRefreshToken("access"),
    validateRequestBody(sendConnectionSchema),
    sendConnection
  );

export default connectionsRouter;
