import epxress from "express";
import http from "http";
import { configDotenv } from "dotenv";

configDotenv();

const PORT = process.env.PORT;

const app = epxress();

const server = http.createServer(app);

server.listen(PORT || 4000, () => {
  console.log(`Server running on port ${PORT}`);
});
