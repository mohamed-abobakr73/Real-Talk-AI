import { Router } from "express";
import validateRequestBody from "../middlewares/validateRequestBody";
import aiInputSchema from "../schemas/aiInputSchema";
import { getAiResponse } from "../controllers/aiController";
import verifyAccessToken from "../middlewares/verifyAccessToken";

const aiRouter = Router();

aiRouter
  .route("/")
  .post(verifyAccessToken, validateRequestBody(aiInputSchema), getAiResponse);

export default aiRouter;
