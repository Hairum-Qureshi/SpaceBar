import { Server } from "socket.io";
import http from "http";
import express from "express";
import redis from "./index";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5174"]
	}
});

io.on("connection", socket => {
	socket.on("ping", () => {
		const key = `active:${socket.handshake.auth.userID}`;
		redis.set(key, "online", {
			EX: 30 // Expiration in seconds
		}); // set TTL to 30 seconds

		// console.log('PONG!');
	});

	socket.on("disconnect", () => {
		console.log("a user disconnected:", socket.id);
	});
});

export { io, app, server };
