import getRedisClient from "../config/redisConnection";

let redisClient: any;
(async function getRedisClientInstance() {
  if (!redisClient) {
    redisClient = await getRedisClient();
  }
  return redisClient;
})();

const redisUtils = {
  set: async (key: string, value: string) => {
    await redisClient.set(key, value);
  },
  get: async (key: string) => {
    return await redisClient.get(key);
  },
  delete: async (key: string) => {
    await redisClient.del(key);
  },
  exists: async (key: string) => {
    return await redisClient.exists(key);
  },
  expire: async (key: string, ttl: number) => {
    await redisClient.expire(key, ttl);
  },
  ttl: async (key: string) => {
    return await redisClient.ttl(key);
  },
};

export default redisUtils;
