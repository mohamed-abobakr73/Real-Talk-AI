import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares";
import connectionsServices from "../services/connectionsServices";
import httpStatusText from "../utils/httpStatusText";

const sendConnection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { connectedUserId } = req.validatedData;
    const currentUserId = req.currentUser?.userId;

    console.log(currentUserId);
    console.log(connectedUserId);
    const connection = await connectionsServices.sendConnectionService(
      currentUserId!,
      connectedUserId
    );

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        connection,
      },
    });
  }
);

export { sendConnection };
