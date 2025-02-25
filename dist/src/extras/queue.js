"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// Configure AWS SDK
aws_sdk_1.default.config.update({ region: "us-east-1" });
// NOT ACTIVATED
const sqs = new aws_sdk_1.default.SQS({ apiVersion: "2012-11-05" });
// Define the queue ARN and URL (Ensure this matches your setup)
const ACCOUNT_ID = "337909759643";
const QUEUE_NAME = "chatSocket";
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${ACCOUNT_ID}/${QUEUE_NAME}`;
const QUEUE_ARN = `arn:aws:sqs:us-east-1:${ACCOUNT_ID}:${QUEUE_NAME}`;
// Function to send a message to SQS
const sendMessage = async (messageBody) => {
    const params = {
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(messageBody),
    };
    try {
        const result = await sqs.sendMessage(params).promise();
        console.log("Message Sent! MessageId:", result.MessageId);
    }
    catch (error) {
        console.error("Error sending message:", error);
    }
};
// NOT ACTIVATED
// Function to receive messages from SQS
const receiveMessages = async () => {
    const params = {
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
        VisibilityTimeout: 30,
    };
    try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages && data.Messages.length > 0) {
            for (const message of data.Messages) {
                console.log("Received Message:", message.Body);
                if (message.ReceiptHandle) {
                    await deleteMessage(message.ReceiptHandle);
                }
            }
        }
        else {
            console.log("No messages available.");
        }
    }
    catch (error) {
        console.error("Error receiving message:", error);
    }
};
// Function to delete a message after processing
const deleteMessage = async (receiptHandle) => {
    const params = {
        QueueUrl: QUEUE_URL,
        ReceiptHandle: receiptHandle,
    };
    try {
        await sqs.deleteMessage(params).promise();
        console.log("Message Deleted!");
    }
    catch (error) {
        console.error("Error deleting message:", error);
    }
};
// Example Usage
// (async () => {
//   await sendMessage({ text: "Hello from SQS!" });
//   await receiveMessages();
// })();
// NOT ACTIVATED
//# sourceMappingURL=queue.js.map