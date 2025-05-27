import { Request } from "express";
import httpStatusText from "../httpStatusText";
import GlobalError from "../GlobalError";
import { TTypeOfToken } from "../../types";

const validateHeadersToken = (typeOfToken: TTypeOfToken, req: Request) => {
  let requestAuth: string = "";
  if (typeOfToken === "access") {
    requestAuth =
      req.headers["authorization"] || (req.headers["Authorization"] as string);
  } else {
    requestAuth = req.cookies["refreshToken"];
  }

  if (!requestAuth) {
    const error = new GlobalError(
      `${typeOfToken} token not found`,
      401,
      httpStatusText.FAIL
    );
    throw error;
  }

  const token = requestAuth!.split(" ")[1];
  if (!token) {
    const error = new GlobalError(
      `${typeOfToken} token not found`,
      401,
      httpStatusText.FAIL
    );
    throw error;
  }
  return token;
};

export default validateHeadersToken;
