"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const readline_1 = __importDefault(require("readline"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create Readline Interface for user input
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Get Server URL from environment
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";
const socket = (0, socket_io_client_1.io)(SERVER_URL);
const roomId = "room1";
const userId = "user1";
// Login request
socket.emit("login", { userId, password: "pass1" });
// Handle successful login
socket.on("login_success", (data) => {
    console.log(`✅ ${data.message}`);
    socket.emit("joinRoom", { roomId });
    sendMessage();
    // Send an initial message
    socket.emit("message", { roomId, sender: userId, message: "Hello everyone!" });
    console.log("Successfully Joined ", { roomId });
});
// Handle failed login
socket.on("login_failed", (data) => {
    console.error(`❌ ${data.message}`);
    socket.disconnect();
});
// Handle incoming messages
socket.on("message", (data) => {
    console.log(`📩 Message from ${data.sender}: ${data.message}`);
});
// Handle connection errors
socket.on("connect_error", (err) => {
    console.error(`⚠️ Connection Error: ${err.message}`);
});
// Function to send messages
const sendMessage = () => {
    rl.question("> ", (message) => {
        const trimmedMessage = message.trim();
        if (trimmedMessage.toLowerCase() === "exit") {
            console.log("👋 Exiting chat...");
            rl.close();
            socket.disconnect();
            process.exit(0);
        }
        if (!trimmedMessage) {
            sendMessage(); // Ignore empty messages
            return;
        }
        socket.emit("message", { roomId, sender: userId, message: trimmedMessage });
        sendMessage();
    });
};
// Start chat after joining the room
socket.on("room_joined", () => {
    console.log(`🚪 Joined room: ${roomId}`);
    sendMessage();
});
// Handle disconnection
socket.on("disconnect", () => {
    console.log("❌ Disconnected from server.");
    process.exit(0);
});
//# sourceMappingURL=index.js.map