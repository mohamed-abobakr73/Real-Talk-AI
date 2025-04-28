import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
type RedisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
let redisClient: RedisClient;

const connectToRedis = async () => {
  const redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  return redisClient;
};

const getRedisClient = async (): Promise<RedisClient> => {
  if (!redisClient) {
    redisClient = await connectToRedis();
  }
  return redisClient;
};

export default getRedisClient;
