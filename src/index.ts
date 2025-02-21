import { io } from "socket.io-client";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000"; // Socket.io server URL
const socket = io(SERVER_URL);

// Create Readline Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let room: string;
let username: string;

// Function to send messages
const sendMessage = () => {
  rl.question("> ", (message) => {
    if (message.toLowerCase() === "exit") {
      console.log("Exiting chat...");
      socket.disconnect();
      process.exit(0);
    }

    socket.emit("sendMessage", { room, sender: username, message });
    sendMessage();
  });
};

// Connect to server
socket.on("connect", () => {
  console.log("Connected to chat server ✅");

  rl.question("Enter your name: ", (name) => {
    username = name;
    rl.question("Enter room name: ", (roomName) => {
      room = roomName;
      socket.emit("joinRoom", room);
      console.log(`Joined room: ${room} 🏠`);
      sendMessage();
    });
  });
});

// Listen for messages
socket.on("receiveMessage", (data: { sender: string; message: string }) => {
  if (data.sender !== username) {
    console.log(`\n${data.sender}: ${data.message}\n> `);
  }
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server ❌");
  process.exit(0);
});
