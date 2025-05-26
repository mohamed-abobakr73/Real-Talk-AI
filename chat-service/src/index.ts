import express, { NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { configDotenv } from "dotenv";
import mongodbConnection from "./config/mongodbConnection";
import consumeMessage from "./utils/rabbitmqUtils/consumeMessage";
import usersServices from "./services/usersServices";
import chatsServices from "./services/chatsServices";
import setupSocket from "./socketHandler";
import morgan from "morgan";
import helmet from "helmet";
import { TErrorResponse, TGlobalError } from "./types";
import httpStatusText from "./utils/httpStatusText";
import chatsRouter from "./routes/chatsRoute";

configDotenv();

const PORT = process.env.PORT;

export const app = express();

mongodbConnection();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/v1/chats", chatsRouter);

app.use(
  (error: TGlobalError, req: Request, res: Response, next: NextFunction) => {
    const errorResponse: TErrorResponse = {
      status: error.statusText || httpStatusText.ERROR,
      message: error.message || "Something went wrong",
      code: error.statusCode || 500,
      data: null,
    };

    if (error.validationErrors) {
      errorResponse.validationErrors = error.validationErrors;
    }
    res.status(error.statusCode || 500).json(errorResponse);
  }
);

const server = http.createServer(app);

setupSocket(server);

consumeMessage("users", usersServices.createUser);
consumeMessage("chats", chatsServices.createChatService);

server.listen(PORT || 4000, () => {
  console.log(`Server running on port ${PORT}`);
});
