import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import urlRoutes from './routes/urlRoutes.js'

dotenv.config();

const app = express();

// middlewares
app.use(cors({ origin: "https://relink.akshaypnair.space", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// database
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes)

app.get("/", (req, res) => {
    res.send("ReLink API is running");
});


export default app;
