import { io, Socket } from "socket.io-client";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

// Define types for messages and events
interface MessagePayload {
    roomId: string;
    sender: string;
    message: string;
}

interface LoginResponse {
    message: string;
}


// Create Readline Interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Get Server URL from environment
const SERVER_URL: string = process.env.SERVER_URL || "http://localhost:5000";
const socket: Socket = io(SERVER_URL);

const roomId: string = "room1";
const userId: string = "user1";

// Login request
socket.emit("login", { userId, password: "pass1" });

// Handle successful login
socket.on("login_success", (data: LoginResponse) => {
    console.log(`✅ ${data.message}`);
    socket.emit("joinRoom", { roomId });
    sendMessage();

    // Send an initial message
    socket.emit("message", { roomId, sender: userId, message: "Hello everyone!" });
    console.log("Successfully Joined ",{roomId})
});

// Handle failed login
socket.on("login_failed", (data: LoginResponse) => {
    console.error(`❌ ${data.message}`);
    socket.disconnect();
});

// Handle incoming messages
socket.on("message", (data: MessagePayload) => {
    console.log(`📩 Message from ${data.sender}: ${data.message}`);
});

// Handle connection errors
socket.on("connect_error", (err) => {
    console.error(`⚠️ Connection Error: ${err.message}`);
});


// Function to send messages
const sendMessage = (): void => {
    rl.question("> ", (message: string) => {
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
