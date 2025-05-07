import prisma from "../config/prismaClient";
import { ConnectionStatus } from "../generated/prisma";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";
import usersServices from "./usersServices";

const getUserConnectionService = async (userId: string) => {
  try {
    const connectedUsers = await prisma.userConnections.findMany({
      where: {
        connectionStatus: ConnectionStatus.accepted,
        OR: [{ userId }, { connectedUserId: userId }],
      },
    });

    return connectedUsers;
  } catch (error) {
    throw error;
  }
};

const getRecievedConnectionsService = async (userId: string) => {
  const recievedConnections = await prisma.userConnections.findMany({
    where: {
      connectedUserId: userId,
    },
  });

  return recievedConnections;
};

const sendConnectionService = async (senderId: string, recieverId: string) => {
  try {
    const reciverExists = await usersServices.getUserService(recieverId);
    const connection = prisma.userConnections.create({
      data: {
        userId: senderId,
        connectedUserId: recieverId,
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

    if (!connection) {
      const error = globalError.create(
        "Connection not found",
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
  getRecievedConnectionsService,
  sendConnectionService,
  updateConnectionStatusService,
  getUserConnectionService,
};
