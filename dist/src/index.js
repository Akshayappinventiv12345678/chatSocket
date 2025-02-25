"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000"; // Socket.io server URL
const socket = (0, socket_io_client_1.io)(SERVER_URL);
// Send login request
socket.emit("login", { userId: "user1", password: "pass1" });
socket.on("login_success", (data) => {
    console.log(data.message);
    socket.emit("joinRoom", "room1");
    // Send a test message
    socket.emit("message", { roomId: "room1", message: { firestmessage: "Hello everyone!" } });
});
socket.on("login_failed", (data) => {
    console.error(data.message);
    socket.disconnect();
});
socket.on("message", (data) => {
    console.log(`Message from ${data.userId}: ${data.message}`);
});
//# sourceMappingURL=index.js.map