"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const readline_1 = __importDefault(require("readline"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000"; // Socket.io server URL
const socket = (0, socket_io_client_1.io)(SERVER_URL);
// Create Readline Interface
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let room;
const userId = "user1";
const roomId = "room1";
// Function to send messages
const sendMessage = () => {
    rl.question("> ", (message) => {
        if (message.toLowerCase() === "exit") {
            console.log("Exiting chat...");
            socket.disconnect();
            process.exit(0);
        }
        console.log("here", message, socket.id);
        socket.emit("sendmessage", { roomId, sender: userId, message });
        sendMessage();
    });
};
// Connect to server
socket.on("connect", () => {
    console.log("Connected to chat server ✅");
    // Login request
    socket.emit("login", { userId, password: "pass1" });
});
// Handle successful login
socket.on("login_success", (data) => {
    console.log(`✅ ${data.message}`);
    socket.emit("joinRoom", { roomId });
    sendMessage();
    // Send an initial message
    socket.emit("sendmessage", { roomId, sender: userId, message: "Hello everyone!" });
    console.log("Successfully Joined ", { roomId });
});
// Handle failed login
socket.on("login_failed", (data) => {
    console.error(`❌ ${data.message}`);
    socket.disconnect();
});
// Listen for messages
socket.on("recievemessage", (data) => {
    console.log("recived", data);
    if (data.sender !== userId) {
        console.log(`\n${data.sender}: ${data.message}\n> `);
    }
});
// Handle disconnection
socket.on("disconnect", () => {
    console.log("Disconnected from server ❌");
    process.exit(0);
});
//# sourceMappingURL=index.js.map