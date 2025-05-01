import getRedisClient from "../config/redisConnection";
import { TRedisClient } from "../types";

class RedisUtils {
  private redisClient: any;
  static instance: RedisUtils;
  constructor() {
    if (RedisUtils.instance) {
      return RedisUtils.instance;
    }
    RedisUtils.instance = this;
    this.redisClient = getRedisClient().then((client) => client);
  }

  public async set(key: string, value: string) {
    await this.redisClient.set(key, value);
  }

  public async get(key: string) {
    return await this.redisClient.get(key);
  }

  public async delete(key: string) {
    await this.redisClient.del(key);
  }

  public async exists(key: string) {
    return await this.redisClient.exists(key);
  }

  public async expire(key: string, ttl: number) {
    await this.redisClient.expire(key, ttl);
  }

  public async ttl(key: string) {
    return await this.redisClient.ttl(key);
  }
}

export default RedisUtils;
