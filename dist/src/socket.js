"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// import { Kafka } from "kafkajs";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
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
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });
    // Handle chat messages
    socket.on("sendMessage", async (data) => {
        const { room, sender, message } = data;
        if (!room || !sender || !message)
            return;
        const newMessage = {
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
        }
        catch (error) {
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
//# sourceMappingURL=socket.js.map