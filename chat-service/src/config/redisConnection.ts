import { createClient } from "redis";
import { TRedisClient } from "../types";
let redisClient: TRedisClient;

const connectToRedis = async () => {
  const redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  return redisClient as unknown as TRedisClient;
};

const getRedisClient = async (): Promise<TRedisClient> => {
  if (!redisClient) {
    redisClient = await connectToRedis();
  }
  return redisClient;
};

export default getRedisClient;
