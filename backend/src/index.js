import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { socketAuth } from "./middleware/socketAuth.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import User from "./models/User.js";
import Chat from "./models/Chat.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
});

app.use(cors());
app.use(express.json());

// ---- Placeholder routes ----
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// ---- Socket placeholder ----
io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("setup", (userId) => {
    socket.join(userId);
  });

  // Join chat room
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });
  // Typing indicators
  socket.on("typing", (chatId) =>
    socket.in(chatId).emit("typing", { chatId, userId: socket.userId })
  );
  socket.on("stop typing", (chatId) =>
    socket.in(chatId).emit("stop typing", chatId)
  );

  // Send message
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});

// ---- DB ----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on ${PORT}`));
