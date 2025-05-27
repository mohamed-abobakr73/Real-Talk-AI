import { NextFunction, Request, Response } from "express";
import { TErrorResponse, TGlobalError } from "../types";
import httpStatusText from "../utils/httpStatusText";

const globalErrorHandler = async (
  error: TGlobalError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

export default globalErrorHandler;
