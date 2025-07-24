import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import colors from "colors";
import mongoose from "mongoose";
import authentication from "./routes/authentication";
import { app, server } from "./socket";
import user from "./routes/user";
import conversation from "./routes/conversation";
import { startRedis } from "./redis-config";

dotenv.config();
colors.enable();

const corsOptions = {
	origin: process.env.FRONTEND_URL,
	credentials: true,
	optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authentication);
app.use("/api/user", user);
app.use("/api/conversation", conversation);

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

			await startRedis();

		} catch (error) {
			console.error(error);
		}
	};

	startServer();
});
