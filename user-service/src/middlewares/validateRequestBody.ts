import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import httpStatusText from "../utils/httpStatusText";
import { fromZodError } from "zod-validation-error";
import globalError from "../utils/globalError";

const validateRequestBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedRequestBody = schema.safeParse(req.body);
    if (!parsedRequestBody.success) {
      const error = globalError.create(
        "Validation error",
        400,
        httpStatusText.FAIL,
        fromZodError(parsedRequestBody.error).details.map(
          (error) => error.message
        )
      );
      next(error);
    }
    req.validatedData = parsedRequestBody.data;
    next();
  };
};

export default validateRequestBody;
