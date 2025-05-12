import jwt from "jsonwebtoken";
import globalError from "../globalError";
import httpStatusText from "../httpStatusText";

const validateAccessToken = (token: string) => {
  let TOKEN_SECRET_KEY: string;
  TOKEN_SECRET_KEY = process.env.JWT_SECRET_KEY!;

  const isValidToken = jwt.verify(token, TOKEN_SECRET_KEY);
  if (!isValidToken) {
    const error = globalError.create(
      `Invalid access token`,
      401,
      httpStatusText.FAIL
    );
    throw error;
  }

  return isValidToken;
};

export default validateAccessToken;
