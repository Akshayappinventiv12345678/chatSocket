"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// import { Kafka } from "kafkajs";
const dotenv_1 = __importDefault(require("dotenv"));
const databasesync_1 = require("./databasesync");
const user_1 = require("./extras/user");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
exports.users = user_1.usersList;
// Function to authenticate users
const authenticateUser = (userId, password) => {
    console.log(exports.users[userId], exports.users[userId].password);
    return exports.users[userId] && exports.users[userId].password === password;
};
// Start Kafka Producer
async function startProducer() {
    //   await producer.connect();
    console.log("Kafka Producer Connected");
}
startProducer();
// Socket.io logic
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    // Expect login credentials before allowing access
    socket.on("login", ({ userId, password }) => {
        if (authenticateUser(userId, password)) {
            console.log(`User ${userId} authenticated successfully.`);
            socket.emit("login_success", { message: "Login successful" });
            // Proceed with socket events after authentication
            socket.on("joinRoom", (roomId) => {
                socket.join(roomId);
                console.log(`User ${userId} joined room ${roomId}`);
            });
            socket.on("message", async ({ roomId, message }) => {
                io.to(roomId).emit("message", { userId, message });
                const newMessage = {
                    room: roomId,
                    sender: userId,
                    message,
                    timestamp: new Date().toISOString(),
                    socketid: socket.id
                };
                await (0, databasesync_1.publishData)(newMessage, roomId);
                console.log(`Message from ${userId} in ${roomId}: ${message}`);
            });
            socket.on("disconnect", () => {
                console.log(`User ${userId} disconnected.`);
            });
        }
        else {
            console.log(`Authentication failed for user ${userId}`);
            socket.emit("login_failed", { message: "Invalid credentials" });
            socket.disconnect(); // Disconnect the user
        }
    });
});
// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Socket Server running on port ${PORT}`));
// publishData({"message":"trial"},"Room1").then(res=> console.log(res)).catch(err=>console.log(err))
//# sourceMappingURL=socket.js.map