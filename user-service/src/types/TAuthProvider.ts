type TAuthProvider = {
  provider: "google" | "github";
  authProviderId: string;
  userId: string;
};

export default TAuthProvider;
