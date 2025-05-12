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
      next(error);
    }

    const user = validateAccessToken(token);
    socket.data.user = user;
  } catch (error: any) {
    next(error);
  }
};

export default verifySocketAccessToken;
