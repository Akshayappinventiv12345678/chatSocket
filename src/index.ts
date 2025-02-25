import { io } from "socket.io-client";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000"; // Socket.io server URL
const socket = io(SERVER_URL);

// Send login request
socket.emit("login", { userId: "user1", password: "pass1" });

socket.on("login_success", (data) => {
    console.log(data.message);
    socket.emit("joinRoom", "room1");

    // Send a test message
    socket.emit("message", { roomId: "room1", message: {firestmessage:"Hello everyone!"} });
});

socket.on("login_failed", (data) => {
    console.error(data.message);
    socket.disconnect();
});

socket.on("message", (data) => {
    console.log(`Message from ${data.userId}: ${data.message}`);
});
