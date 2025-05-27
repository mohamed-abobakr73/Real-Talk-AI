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
