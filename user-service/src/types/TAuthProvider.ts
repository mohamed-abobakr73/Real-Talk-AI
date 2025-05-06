import { AuthProviderType } from "../generated/prisma";

type TAuthProvider = {
  provider: AuthProviderType;
  authProviderId: string;
  userId: string;
};

export default TAuthProvider;
