import redisUtils from "../redisUtils";

const saveOtpToRedis = async (email: string, otp: string) => {
  redisUtils.set(email, otp);
};

export default saveOtpToRedis;
