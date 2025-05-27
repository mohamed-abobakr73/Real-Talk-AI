import jwt from "jsonwebtoken";
import GlobalError from "../GlobalError";
import httpStatusText from "../httpStatusText";
import { TTypeOfToken } from "../../types";
const validateAccessOrRefreshToken = (
  typeOfToken: TTypeOfToken,
  token: string
) => {
  let TOKEN_SECRET_KEY: string;
  if (typeOfToken === "access") {
    TOKEN_SECRET_KEY = process.env.JWT_SECRET_KEY!;
  } else {
    TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY!;
  }

  const isValidToken = jwt.verify(token, TOKEN_SECRET_KEY);
  if (!isValidToken) {
    const error = new GlobalError(
      `Invalid ${typeOfToken} token`,
      401,
      httpStatusText.FAIL
    );
    throw error;
  }

  return isValidToken;
};

export default validateAccessOrRefreshToken;
