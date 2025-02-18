// index.js
import express from "express";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Allow CORS from both the frontend deployed URL and localhost
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://cosmoblog-frontend1.onrender.com'] // production URL
  : ['http://localhost:5173']; // development URL (or any other local setup)

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Clerk authentication middleware
app.use(clerkMiddleware());

// Middleware for JSON, except for webhooks
app.use("/webhooks", express.raw({ type: "application/json" }));
app.use(express.json());

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
connectDB(); // Ensure DB is connected before server starts

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
