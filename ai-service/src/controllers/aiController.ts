import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import httpStatusText from "../utils/httpStatusText";
import aiServices from "../services/aiServices";

const getAiResponse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, data } = req.validatedData;

    const aiResponse = await aiServices.generateAiResponseService(type, data);

    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { response: aiResponse } });
  }
);

const getSpeechToText = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      req.validatedData.audio = req.file;
    }
    console.log(req.validatedData);
  }
);

export { getAiResponse, getSpeechToText };
