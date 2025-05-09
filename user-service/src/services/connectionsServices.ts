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

    const connectedUsers = await prisma.userConnections.findMany({
      skip: offset,
      take: limit,
      where: {
        connectionStatus: ConnectionStatus.accepted,
        OR: [{ userId }, { connectedUserId: userId }],
      },
    });

    const pagination = paginationInfo(connectedUsers.length, limit, offset);

    return { connectedUsers, pagination };
  } catch (error) {
    throw error;
  }
};

const getRecievedConnectionsService = async (
  userId: string,
  paginationData: TPaginationData
) => {
  const { limit, offset } = paginationData;
  const recievedConnections = await prisma.userConnections.findMany({
    skip: offset,
    take: limit,
    where: {
      connectedUserId: userId,
      connectionStatus: "pending",
    },
  });

  const pagination = paginationInfo(recievedConnections.length, limit, offset);

  return { recievedConnections, pagination };
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
