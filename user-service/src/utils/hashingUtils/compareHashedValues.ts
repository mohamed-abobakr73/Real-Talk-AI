import bcrypt from "bcrypt";

const compareHashedValues = async (value: string, hashedValue: string) => {
  const isMatch = await bcrypt.compare(value, hashedValue);
  return isMatch;
};

export default compareHashedValues;
