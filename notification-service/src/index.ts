import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import mongodbConnection from "./config/mongodbConnection";
import consumeMessage from "./utils/rabbitmqUtils/consumeMessage";
import chatsServices from "./services/chatsServices";
import notificationsRouter from "./routes/notificationsRoute";
import notificationsServices from "./services/notificationsServices";
import { createLimiter, globalErrorHandler } from "./middlewares";

configDotenv();

const PORT = process.env.PORT;

mongodbConnection();

const app = express();

const startServer = async () => {
  const limiter = await createLimiter();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));
  app.use(limiter);
  app.use(mongoSanitize());
  app.use(helmet());

  app.use("/api/v1/notifications", notificationsRouter);

  app.use(globalErrorHandler);
};

startServer();

consumeMessage("chatCreated", chatsServices.createChatService);
consumeMessage(
  "messages",
  notificationsServices.sentChatMessageNotificationService
);

app.listen(PORT || 4002, () => {
  console.log(`Server running on port ${PORT}`);
});
