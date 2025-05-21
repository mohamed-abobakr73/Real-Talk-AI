// import { createClient } from "redis";
// import { TRedisClient } from "../types";
// let redisClient: TRedisClient;

// const connectToRedis = async () => {
//   const redisClient = await createClient()
//     .on("error", (err) => console.log("Redis Client Error", err))
//     .connect();
//   return redisClient as unknown as TRedisClient;
// };

// const getRedisClient = async (): Promise<TRedisClient> => {
//   if (!redisClient) {
//     redisClient = await connectToRedis();
//   }
//   return redisClient;
// };

// export default getRedisClient;

// redisConnection.ts
import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379", // or your Redis connection URL
});

client.on("error", (err) => console.error("Redis Client Error", err));

const getRedisClient = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
};

export default getRedisClient;
