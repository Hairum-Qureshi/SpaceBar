import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5174"]
	}
});

io.on("connection", socket => {
	console.log("a new user connected:", socket.id);

	socket.on("disconnect", () => {
		console.log("a user disconnected:", socket.id);
	});
});

export { io, app, server };
