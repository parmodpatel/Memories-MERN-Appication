import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import cloudinaryRoutes from "./routes/cloudinary.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true}));
app.use(cookieParser());

const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// express middleware
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);
app.use("/cloudinary", cloudinaryRoutes);

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.error(error.message));
