import prisma from "../config/prismaClient";
import { ConnectionStatus } from "../generated/prisma";
import { TChatType, TPaginationData } from "../types";
import GlobalError from "../utils/GlobalError";
import httpStatusText from "../utils/httpStatusText";
import paginationInfo from "../utils/paginationUtils/paginationInfo";
import publishMessage from "../utils/rabbitmqUtils/publishMessage";
import usersServices from "./usersServices";

const sendChatUsersToQueue = async (
  queueName: string,
  chatPayload: { users: string[]; chatType: TChatType }
) => {
  const stringifiedChatData = JSON.stringify(chatPayload);
  const sentMessage = await publishMessage(queueName, stringifiedChatData);
  return sentMessage;
};

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

    const pagination = paginationInfo(count, offset, limit);

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

  const pagination = paginationInfo(count, offset, limit);

  return { receivedConnections, pagination };
};

const getUserSentConnectionsService = async (
  userId: string,
  paginationData: TPaginationData
) => {
  const { limit, offset } = paginationData;
  const count = await prisma.userConnections.count({
    where: {
      userId,
      connectionStatus: "pending",
    },
  });

  const sentConnections = await prisma.userConnections.findMany({
    skip: offset,
    take: limit,
    where: {
      userId,
      connectionStatus: "pending",
    },
  });

  const pagination = paginationInfo(count, offset, limit);

  return { sentConnections, pagination };
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
    const connection = await prisma.userConnections.findFirst({
      where: {
        id: connectionId,
      },
    });

    if (!connection || connection.connectionStatus !== "pending") {
      const error = new GlobalError(
        "Connection not found, or already accepted or rejected",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }

    if (connection.connectedUserId !== userId) {
      const error = new GlobalError(
        "You are not authorized to update this connection",
        401,
        httpStatusText.FAIL
      );
      throw error;
    }

    const updateConnection = await prisma.userConnections.update({
      where: {
        id: connectionId,
      },
      data: {
        connectionStatus: status,
      },
    });

    if (status === "accepted") {
      await sendChatUsersToQueue("chats", {
        users: [connection.userId, connection.connectedUserId],
        chatType: "private",
      });
    }

    return updateConnection;
  } catch (error) {
    throw error;
  }
};

export default {
  getReceivedConnectionsService,
  getUserSentConnectionsService,
  getUserConnectionService,
  sendConnectionService,
  updateConnectionStatusService,
};
