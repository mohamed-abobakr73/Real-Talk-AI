import epxress from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
import mongodbConnection from "./config/mongodbConnection";
import connectRabbitMQ from "./config/connectToRabbitMq";
import consumeMessage from "./utils/rabbitmqUtils/consumeMessage";

configDotenv();

const PORT = process.env.PORT;

const app = epxress();

mongodbConnection();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const test = async () => {
  const message = await consumeMessage("users");
  console.log(message);
};

test().then((msg) => console.log("this is message", msg));

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // Join chat room
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`📥 ${socket.id} joined room ${chatId}`);
  });

  // Handle sending messages
  socket.on("send_message", (messageData) => {
    const { chatId, senderId, content } = messageData;
    const message = {
      chatId,
      senderId,
      content,
      createdAt: new Date(),
    };
    console.log("📨 Message received:", message);
    io.to(chatId).emit("receive_message", message);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(PORT || 4000, () => {
  console.log(`Server running on port ${PORT}`);
});
