import express from "express";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";  // <-- Import dotenv at the top

// Load environment variables from the .env file
dotenv.config();  // <-- Add this line to load the .env file

const app = express();

// Enable CORS
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Clerk authentication middleware
app.use(clerkMiddleware());

// Middleware for JSON, except for webhooks
app.use("/webhooks", express.raw({ type: "application/json" })); // Webhooks require raw body
app.use(express.json()); // Other routes use normal JSON parsing

// API Routes
app.use("/webhooks", webhookRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

// Global Error Handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
