type TGroupChatData = {
  users: { userId: string; role: "admin" | "user"; mutedUntil?: Date }[];
  avatar?: string;
  name: string;
};

export default TGroupChatData;
