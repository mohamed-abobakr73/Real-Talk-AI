import { ExtendedError, Socket } from "socket.io";
import globalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";
import { validateAccessToken } from "../utils/jwtUtils";

const verifySocketAccessToken = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => any
) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      const error = globalError.create(
        "Access token not found",
        401,
        httpStatusText.FAIL
      );
      throw error;
    }

    const user = validateAccessToken(token);
    socket.data.user = user;
    next();
  } catch (error: any) {
    next(error as ExtendedError);
  }
};

export default verifySocketAccessToken;
