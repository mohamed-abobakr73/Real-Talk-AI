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

const getUserSentConnections = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser?.userId;

    const paginationData = paginationParams(req.query);

    const { sentConnections, pagination } =
      await connectionsServices.getUserSentConnectionsService(
        userId!,
        paginationData
      );

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        sentConnections,
        pagination,
      },
    });
  }
);

const getReceivedConnections = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser?.userId;

    const paginationData = paginationParams(req.query);

    const { receivedConnections, pagination } =
      await connectionsServices.getReceivedConnectionsService(
        userId!,
        paginationData
      );

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        receivedConnections,
        pagination,
      },
    });
  }
);

const sendConnection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { connectedUserId } = req.validatedData;
    const currentUserId = req.currentUser?.userId;

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
  getReceivedConnections,
  getUserSentConnections,
  sendConnection,
  updateConnectionStatus,
};
