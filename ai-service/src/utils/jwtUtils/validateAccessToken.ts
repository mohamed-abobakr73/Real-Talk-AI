import jwt from "jsonwebtoken";
import GlobalError from "../globalError";
import httpStatusText from "../httpStatusText";

const validateAccessToken = (token: string) => {
  try {
    const TOKEN_SECRET_KEY = process.env.JWT_SECRET_KEY!;

    const isValidToken = jwt.verify(token, TOKEN_SECRET_KEY);
    if (!isValidToken) {
      const error = new GlobalError(
        "Invalid access token",
        401,
        httpStatusText.FAIL
      );
      throw error;
    }

    return isValidToken;
  } catch (error) {
    throw error;
  }
};

export default validateAccessToken;
