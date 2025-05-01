import globalError from "../globalError";
import compareHashedValues from "../hashingUtils/compareHashedValues";
import httpStatusText from "../httpStatusText";
import redisUtils from "../redisUtils";

const verifyOtp = async (email: string, otp: string) => {
  const hashedOtp = await redisUtils.get(email);
  if (!hashedOtp) {
    const error = globalError.create(
      "Invalid email address or otp expired",
      400,
      httpStatusText.FAIL
    );
    throw error;
  }
  const isMatch = await compareHashedValues(otp, hashedOtp);
  return isMatch;
};

export default verifyOtp;
