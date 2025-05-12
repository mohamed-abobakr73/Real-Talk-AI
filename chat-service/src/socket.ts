import { Server } from "socket.io";
import http from "http";

const setupSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
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
};

export default setupSocket;
