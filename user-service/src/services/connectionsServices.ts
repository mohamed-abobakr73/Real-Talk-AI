import prisma from "../config/prismaClient";
import { ConnectionStatus } from "../generated/prisma";
import { TPaginationData } from "../types";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";
import paginationInfo from "../utils/paginationUtils/paginationInfo";
import usersServices from "./usersServices";

const getUserConnectionService = async (
  userId: string,
  paginationData: TPaginationData
) => {
  try {
    const { limit, offset } = paginationData;

    const count = await prisma.userConnections.count({
      where: {
        OR: [{ userId }, { connectedUserId: userId }],
        connectionStatus: ConnectionStatus.accepted,
      },
    });

    const connectedUsers = await prisma.userConnections.findMany({
      skip: offset,
      take: limit,
      where: {
        connectionStatus: ConnectionStatus.accepted,
        OR: [{ userId }, { connectedUserId: userId }],
      },
    });

    const pagination = paginationInfo(count, connectedUsers.length, limit);

    return { connectedUsers, pagination };
  } catch (error) {
    throw error;
  }
};

const getReceivedConnectionsService = async (
  userId: string,
  paginationData: TPaginationData
) => {
  const { limit, offset } = paginationData;
  const count = await prisma.userConnections.count({
    where: {
      connectedUserId: userId,
      connectionStatus: "pending",
    },
  });

  const receivedConnections = await prisma.userConnections.findMany({
    skip: offset,
    take: limit,
    where: {
      connectedUserId: userId,
      connectionStatus: "pending",
    },
  });

  const pagination = paginationInfo(count, receivedConnections.length, limit);

  return { receivedConnections, pagination };
};

const sendConnectionService = async (senderId: string, receiverId: string) => {
  try {
    const receiverExists = await usersServices.getUserService(receiverId);
    const connection = prisma.userConnections.create({
      data: {
        userId: senderId,
        connectedUserId: receiverId,
      },
    });
    return connection;
  } catch (error) {
    throw error;
  }
};

const updateConnectionStatusService = async (
  connectionId: string,
  status: ConnectionStatus,
  userId: string
) => {
  try {
    const connection = await prisma.userConnections.update({
      where: {
        id: connectionId,
      },
      data: {
        connectionStatus: status,
      },
    });

    if (!connection || connection.connectionStatus !== "pending") {
      const error = globalError.create(
        "Connection not found, or already accepted or rejected",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }

    if (connection.userId !== userId) {
      const error = globalError.create(
        "You are not authorized to update this connection",
        401,
        httpStatusText.FAIL
      );
      throw error;
    }

    return connection;
  } catch (error) {
    throw error;
  }
};

export default {
  getReceivedConnectionsService,
  sendConnectionService,
  updateConnectionStatusService,
  getUserConnectionService,
};
