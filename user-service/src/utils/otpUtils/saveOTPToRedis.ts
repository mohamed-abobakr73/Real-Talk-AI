import redisUtils from "../redisUtils";

const saveOtpToRedis = async (email: string, otp: string) => {
  await redisUtils.set(email, otp, 5 * 60);
};

export default saveOtpToRedis;
