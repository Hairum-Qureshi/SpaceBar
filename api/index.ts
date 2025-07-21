import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import colors from "colors";
import mongoose from "mongoose";
import authentication from "./routes/authentication";
import * as Redis from "redis";
import { app, server } from "./socketIo";
import user from "./routes/user";

dotenv.config();
colors.enable();

const corsOptions = {
	origin: "http://localhost:5174",
	credentials: true,
	optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authentication);
app.use("/api/user", user);

const PORT: string | number = process.env.PORT || 3000;

server.listen(PORT, () => {
	const startServer = async () => {
		try {
			const conn = await mongoose.connect(process.env.MONGO_URI!);
			console.log(
				"Successfully connected to MongoDB on host:".yellow,
				`${conn.connection.host}`.green.bold
			);
			console.log(`Server listening on port ${PORT}!`.yellow.bold);

			const redis_client = Redis.createClient({
				url: process.env.REDIS_URL
			});

			redis_client.on("error", err => {
				console.error("Redis error:".red.bold, err);
			});

			redis_client.connect().then(() => {
				console.log("Successfully connected to".yellow, "Redis!".red.bold);
			});
		} catch (error) {
			console.error(error);
		}
	};

	startServer();
});
