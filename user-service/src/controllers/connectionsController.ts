import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares";
import connectionsServices from "../services/connectionsServices";
import httpStatusText from "../utils/httpStatusText";
import paginationParams from "../utils/paginationUtils/paginationParams";

const getUserConnections = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser?.userId;

    const paginationData = paginationParams(req.query);

    const { connectedUsers: userConnections, pagination } =
      await connectionsServices.getUserConnectionService(
        userId!,
        paginationData
      );

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        userConnections,
        pagination,
      },
    });
  }
);

const getRecievedConnections = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser?.userId;

    const paginationData = paginationParams(req.query);

    const { recievedConnections, pagination } =
      await connectionsServices.getRecievedConnectionsService(
        userId!,
        paginationData
      );

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        recievedConnections,
        pagination,
      },
    });
  }
);

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

const updateConnectionStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { connectionId } = req.params;
    const { status } = req.validatedData;
    const userId = req.currentUser?.userId;

    const updatedConnection =
      await connectionsServices.updateConnectionStatusService(
        connectionId,
        status,
        userId!
      );

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        updatedConnection,
      },
    });
  }
);

export {
  getUserConnections,
  getRecievedConnections,
  sendConnection,
  updateConnectionStatus,
};
