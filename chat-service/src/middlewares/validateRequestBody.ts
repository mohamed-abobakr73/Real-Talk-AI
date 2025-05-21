import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import httpStatusText from "../utils/httpStatusText";
import { fromZodError } from "zod-validation-error";
import GlobalError from "../utils/GlobalError";

const validateRequestBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedRequestBody = schema.safeParse(req.body);
    if (!parsedRequestBody.success) {
      const zodErrors = fromZodError(parsedRequestBody.error).details.map(
        (error) => error.message
      );
      const error = new GlobalError(
        "Validation error",
        400,
        httpStatusText.FAIL,
        zodErrors
      );

      return next(error);
    }
    req.validatedData = parsedRequestBody.data;
    next();
  };
};

export default validateRequestBody;
