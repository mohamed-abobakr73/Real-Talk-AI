import globalError from "../globalError";
import compareHashedValues from "../hashingUtils/compareHashedValues";
import httpStatusText from "../httpStatusText";
import redisUtils from "../redisUtils";

const verifyOtpCode = async (email: string, otp: string) => {
  const hashedOtp = await redisUtils.get(email);
  if (!hashedOtp) {
    const error = globalError.create(
      "OTP Code expired, please try again with a new OTP via the resend OTP",
      400,
      httpStatusText.FAIL
    );
    throw error;
  }
  const isMatch = await compareHashedValues(otp, hashedOtp);
  return isMatch;
};

export default verifyOtpCode;
