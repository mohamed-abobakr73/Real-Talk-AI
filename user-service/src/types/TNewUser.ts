type TNewUser = {
  email: string;
  username: string;
  password?: string;
  profileImage?: string;
  verified?: boolean;
  createdAt?: Date;
};

export default TNewUser;
