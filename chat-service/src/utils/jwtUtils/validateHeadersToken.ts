import { Request } from "express";
import httpStatusText from "../httpStatusText";
import globalError from "../globalError";

const validateHeadersToken = (req: Request) => {
  let requestAuth: string = "";
  requestAuth =
    req.headers["authorization"] || (req.headers["Authorization"] as string);

  if (!requestAuth) {
    const error = globalError.create(
      "Access token not found",
      401,
      httpStatusText.FAIL
    );
    throw error;
  }

  const token = requestAuth!.split(" ")[1];
  if (!token) {
    const error = globalError.create(
      "Access token not found",
      401,
      httpStatusText.FAIL
    );
    throw error;
  }
  return token;
};

export default validateHeadersToken;
