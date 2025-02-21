import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
// import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// // Initialize Kafka Producer
// const kafka = new Kafka({
//   clientId: "chat-app",
//   brokers: [process.env.KAFKA_BROKER!], // e.g., "localhost:9092"
// });
// const producer = kafka.producer();

interface Message {
  room: string;
  sender: string;
  message: string;
  timestamp: string;
}

// Start Kafka Producer
async function startProducer() {
//   await producer.connect();
  console.log("Kafka Producer Connected");
}

startProducer();

// Socket.io logic
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // User joins a room
  socket.on("joinRoom", (room: string) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle chat messages
  socket.on("sendMessage", async (data: { room: string; sender: string; message: string }) => {
    const { room, sender, message } = data;
    if (!room || !sender || !message) return;

    const newMessage: Message = {
      room,
      sender,
      message,
      timestamp: new Date().toISOString(),
    };

    try {
      // Send message to Kafka
    //   await producer.send({
    //     topic: "chat-messages",
    //     messages: [{ value: JSON.stringify(newMessage) }],
    //   });

      // Emit message to room
      io.to(room).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error sending message to Kafka:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Socket Server running on port ${PORT}`));
