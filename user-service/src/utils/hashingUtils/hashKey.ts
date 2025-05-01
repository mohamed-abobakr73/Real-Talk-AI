import bcrypt from "bcrypt";
const hashKey = async (element: string) => {
  const hash = await bcrypt.hash(element, 10);
  return hash;
};

export default hashKey;
