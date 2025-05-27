import { configDotenv } from "dotenv";
import { createClient } from "redis";

configDotenv();

const REDIS_CONNECTION_URL = process.env.REDIS_CONNECTION_URL!;

const client = createClient({
  url: REDIS_CONNECTION_URL,
});

client.on("error", (err) => console.error("Redis Client Error", err));

const getRedisClient = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
};

export default getRedisClient;
