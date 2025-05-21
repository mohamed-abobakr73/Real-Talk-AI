import getRedisClient from "../config/redisConnection";

let redisClient: any;

const ensureClient = async () => {
  if (!redisClient) {
    redisClient = await getRedisClient();
  }
  return redisClient;
};

const redisUtils = {
  set: async (key: string, value: string, ttl?: number) => {
    const client = await ensureClient();
    await redisClient.client(key, value, { EX: ttl });
  },
  get: async (key: string) => {
    const client = await ensureClient();
    return await client.get(key);
  },
  delete: async (key: string) => {
    await redisClient.del(key);
  },
  exists: async (key: string) => {
    const client = await ensureClient();
    return await client.exists(key);
  },
  expire: async (key: string, ttl: number) => {
    const client = await ensureClient();
    await client.expireat(key, ttl);
  },
  ttl: async (key: string) => {
    const client = await ensureClient();
    return await client.ttl(key);
  },

  // Hash operations
  hset: async (hashKey: string, field: string, value: string) => {
    const client = await ensureClient();
    await client.hSet(hashKey, field, value);
  },

  hget: async (hashKey: string, field: string) => {
    const client = await ensureClient();
    return await client.hGet(hashKey, field);
  },

  hdel: async (hashKey: string, field: string) => {
    const client = await ensureClient();
    await client.hDel(hashKey, field);
  },

  hgetall: async (hashKey: string) => {
    const client = await ensureClient();
    return await client.hGetAll(hashKey);
  },

  hkeys: async (hashKey: string) => {
    const client = await ensureClient();
    return await client.hKeys(hashKey);
  },

  hvals: async (hashKey: string) => {
    const client = await ensureClient();
    return await client.hKals(hashKey);
  },

  hexists: async (hashKey: string, field: string) => {
    const client = await ensureClient();
    return await client.hExists(hashKey, field);
  },
};

export default redisUtils;
