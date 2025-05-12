import epxress from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
import mongodbConnection from "./config/mongodbConnection";
import consumeMessage from "./utils/rabbitmqUtils/consumeMessage";
import usersServices from "./services/usersServices";
import chatsServices from "./services/chatsServices";
import setupSocket from "./socket";

configDotenv();

const PORT = process.env.PORT;

export const app = epxress();

mongodbConnection();

app.use(cors());

const server = http.createServer(app);

setupSocket(server);

consumeMessage("users", usersServices.createUser);
consumeMessage("chats", chatsServices.createChat);

server.listen(PORT || 4000, () => {
  console.log(`Server running on port ${PORT}`);
});
