import { Profile } from "passport";
import { TAuthProvider, TNewUser } from "../types";
import prisma from "../config/prismaClient";
import authServices from "./authServices";

const createAuthProviderService = async (authProviderData: TAuthProvider) => {
  try {
    const authProvider = await prisma.authProviders.create({
      data: authProviderData,
    });

    return authProvider;
  } catch (error) {
    throw error;
  }
};

const checkIfUserAlreadyExists = async (email: string, profile: Profile) => {
  const userAlreadyExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userAlreadyExists) {
    return { userAlreadyExists, userData: null };
  }

  const userData: TNewUser = {
    username: profile.displayName!,
    email,
    profileImage: profile.photos?.[0]?.value,
    verified: true,
  };
  return { userAlreadyExists, userData };
};

const createUserAndAuthProviderIfDoesNotExists = async (
  userData: TNewUser,
  profile: Profile
) => {
  const user = await authServices.signupService(userData);

  const authProviderData: TAuthProvider = {
    provider: "google",
    authProviderId: profile.id,
    userId: user.userId,
  };

  await createAuthProviderService(authProviderData);
  return user;
};

const checkIfAuthProviderExists = async (userId: string, profile: Profile) => {
  const provider = "google";
  const authProviderId = profile.id;

  const authProvider = await prisma.authProviders.findFirst({
    where: { authProviderId, provider: provider },
  });

  if (authProvider) {
    return { authProvider, authProviderData: null };
  }

  const authProviderData: TAuthProvider = {
    provider: "google",
    authProviderId,
    userId,
  };

  return { authProvider, authProviderData };
};

const googleAuthService = async (profile: Profile) => {
  const email: string = profile.emails?.[0]?.value!;
  const { userAlreadyExists, userData } = await checkIfUserAlreadyExists(
    email,
    profile
  );

  if (!userAlreadyExists) {
    const user = await createUserAndAuthProviderIfDoesNotExists(
      userData!,
      profile
    );
    return user;
  }

  const userId = userAlreadyExists.userId;

  const { authProvider, authProviderData } = await checkIfAuthProviderExists(
    userId,
    profile
  );

  if (authProvider) {
    return;
  }

  await createAuthProviderService(authProviderData!);
};

export default { googleAuthService };
