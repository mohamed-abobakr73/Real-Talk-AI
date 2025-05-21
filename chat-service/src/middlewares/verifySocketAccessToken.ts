import { ExtendedError, Socket } from "socket.io";
import GlobalError from "../utils/GlobalError";
import httpStatusText from "../utils/httpStatusText";
import { validateAccessToken } from "../utils/jwtUtils";

const verifySocketAccessToken = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => any
) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      const error = new GlobalError(
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
    return next(error as ExtendedError);
  }
};

export default verifySocketAccessToken;
