type TChatUser = {
  user: string;
  role: "admin" | "user";
  mutedUntil?: Date;
};

export default TChatUser;
