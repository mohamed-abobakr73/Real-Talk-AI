import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
type TRedisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
export default TRedisClient;
