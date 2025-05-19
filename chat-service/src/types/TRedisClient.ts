import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
type TRedisClient = RedisClientType<
  RedisModules,
  RedisFunctions,
  RedisScripts,
  3
>;
export default TRedisClient;
