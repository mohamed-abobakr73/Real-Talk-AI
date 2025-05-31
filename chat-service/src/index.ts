import express from "express";
import http from "http";
import cors from "cors";
import { configDotenv } from "dotenv";
import mongodbConnection from "./config/mongodbConnection";
import mongoSanitize from "express-mongo-sanitize";
import consumeMessage from "./utils/rabbitmqUtils/consumeMessage";
import usersServices from "./services/usersServices";
import chatsServices from "./services/chatsServices";
import setupSocket from "./socketHandler";
import morgan from "morgan";
import helmet from "helmet";

import chatsRouter from "./routes/chatsRoute";
import { createLimiter, globalErrorHandler } from "./middlewares";

configDotenv();

const PORT = process.env.PORT;

export const app = express();

mongodbConnection();

const startApp = async () => {
  const limiter = await createLimiter();

  app.use(cors());
  app.use(express.json({ limit: "3mb" }));
  app.use(express.urlencoded({ extended: true, limit: "3mb" }));
  app.use(morgan("dev"));
  app.use(limiter);
  app.use(mongoSanitize());
  app.use(helmet());

  app.use("/api/v1/chats", chatsRouter);

  app.use(globalErrorHandler);
};

startApp();

const server = http.createServer(app);

setupSocket(server);

consumeMessage("users", usersServices.createUser);
consumeMessage("chats", chatsServices.createChatService);

server.listen(PORT || 3001, () => {
  console.log(`Server running on port ${PORT}`);
});
