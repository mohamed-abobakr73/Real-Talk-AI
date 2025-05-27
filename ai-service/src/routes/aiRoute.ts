import { Router } from "express";
import { validateRequestBody } from "../middlewares";
import aiInputSchema from "../schemas/aiInputSchema";
import { getAiResponse, getSpeechToText } from "../controllers/aiController";
import { verifyAccessToken } from "../middlewares";
import upload from "../config/multer";

const aiRouter = Router();

aiRouter
  .route("/")
  .post(verifyAccessToken, validateRequestBody(aiInputSchema), getAiResponse);

aiRouter
  .route("/speech-to-text")
  .post(verifyAccessToken, upload.single("audio"), getSpeechToText);
export default aiRouter;
