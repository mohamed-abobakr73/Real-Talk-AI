import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares";
import httpStatusText from "../utils/httpStatusText";
import aiServices from "../services/aiServices";
import GlobalError from "../utils/globalError";

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
    if (!req.file) {
      const error = new GlobalError(
        "No audio file provided",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    const speechText = await aiServices.speechToTextService(req.file);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { speechText: speechText },
    });
  }
);

export { getAiResponse, getSpeechToText };
