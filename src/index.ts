import { io } from "socket.io-client";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000"; // Socket.io server URL
const socket = io(SERVER_URL);
// Define types for messages and events
interface MessagePayload {
  roomId: string;
  sender: string;
  message: string;
}

interface LoginResponse {
  message: string;
}

// Create Readline Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let room: string;


const userId="user1"
const roomId="room1"

// Function to send messages
const sendMessage = () => {
  rl.question("> ", (message) => {
    if (message.toLowerCase() === "exit") {
      console.log("Exiting chat...");
      socket.disconnect();
      process.exit(0);
    }
    console.log("here", message,socket.id)

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
socket.on("login_success", (data: LoginResponse) => {
    console.log(`✅ ${data.message}`);
    socket.emit("joinRoom", { roomId });
    sendMessage();

    // Send an initial message
    socket.emit("sendmessage", { roomId, sender: userId, message: "Hello everyone!" });
    console.log("Successfully Joined ",{roomId})
});

// Handle failed login
socket.on("login_failed", (data: LoginResponse) => {
    console.error(`❌ ${data.message}`);
    socket.disconnect();
});
// Listen for messages
socket.on("recievemessage", (data: any) => {
  console.log("recived",data)
  if (data.sender !== userId) {
    console.log(`\n${data.sender}: ${data.message}\n> `);
  }
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server ❌");
  process.exit(0);
});