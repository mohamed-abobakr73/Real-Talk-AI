import { User } from "../../generated/prisma";
import generateJWT from "./generateJWT";
import generateRefreshToken from "./generateRefreshToken";

const getTokensAfterRegistrationOrLogin = (user: User) => {
  const tokenPayload = {
    id: user.userId,
    username: user.username,
    email: user.email,
  };

  const token = generateJWT(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return { user, token, refreshToken };
};

export default getTokensAfterRegistrationOrLogin;
