type TChatUser = {
  user: string;
  role: "admin" | "user";
  mutedUntil?: Date | null;
};

export default TChatUser;
