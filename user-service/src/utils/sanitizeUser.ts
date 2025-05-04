import { User } from "../generated/prisma";

const sanitizeUser = (user: User) => {
  const { password, ...safeData } = user;
  return safeData;
};
export default sanitizeUser;
