import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import { TErrorResponse, TGlobalError } from "./types";
import httpStatusText from "./utils/httpStatusText";
import mongodbConnection from "./config/mongodbConnection";
import consumeMessage from "./utils/rabbitmqUtils/consumeMessage";
import chatsServices from "./services/chatsServices";
import notificationsRouter from "./routes/notificationsRoute";

configDotenv();

const PORT = process.env.PORT;

mongodbConnection();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/v1/notifications", notificationsRouter);

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

consumeMessage("chatCreated", chatsServices.createChatService);

app.listen(PORT || 4002, () => {
  console.log(`Server running on port ${PORT}`);
});
