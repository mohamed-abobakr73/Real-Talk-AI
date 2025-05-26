type TChat = {
  chatId: string;
  users: { userId: string }[];
  avatar?: string;
  name?: string;
};

export default TChat;
