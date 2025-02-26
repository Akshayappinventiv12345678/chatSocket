import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
// import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import { publishData } from "./databasesync";
import { usersList } from "./extras/user";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

export const users: any =usersList;

// Function to authenticate users
const authenticateUser = (userId: string, password: string): boolean => {
  console.log(users[userId] ,users[userId].password  )
  return users[userId] && users[userId].password === password;
};

interface Message {
  room: string;
  sender: string;
  message: string;
  timestamp: string;
  socketid:string;
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

          socket.on("sendmessage", async ({ roomId, message }) => {
        

              const newMessage: Message = {
                room:roomId,
                sender:userId,
                message,
                timestamp: new Date().toISOString(),
                socketid:socket.id
              };
              console.log("emiiting by server ", roomId,newMessage)

              io.to(roomId).emit("recievemessage", newMessage);

              
              await publishData(newMessage,roomId);
              console.log(`Message from ${userId} in ${roomId}: ${message}`);
          });

          socket.on("disconnect", () => {
              console.log(`User ${userId} disconnected.`);
          });

          setTimeout(() => {
            console.log("tiemr")
            io.to("room1").emit("recievemessage", { roomId: "room1", sender: "Server", message: "Test message!" });
          }, 5000);

      } else {
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

