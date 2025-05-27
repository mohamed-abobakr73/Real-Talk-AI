import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import getRedisClient from "../config/redisConnection";

const createLimiter = async () => {
  const redisClient = await getRedisClient();

  const limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: "rate_limit:",
    }),
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many request sent",
  });

  return limiter;
};

export default createLimiter;
