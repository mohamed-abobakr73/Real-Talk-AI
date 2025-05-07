import prisma from "../config/prismaClient";
import usersServices from "./usersServices";

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

export default {
  getRecievedConnectionsService,
  sendConnectionService,
};
