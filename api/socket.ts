import { Server } from "socket.io";
import http from "http";
import express from "express";
import { redis } from "./redis-config";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: [process.env.FRONTEND_URL!]
	}
});

const updateActiveUsers = async () => {
	const keys = await redis.keys("active:*");
	const activeUsers = keys.map(key => key.replace("active:", ""));
	// console.log("activeUsers", activeUsers);
	io.emit("activeUsers", activeUsers);
};

let lastUpdateTime = 0;

const throttle = async () => {
	const now = Date.now();

	if (now - lastUpdateTime >= 5000) {
		// only allow once every 5 seconds
		lastUpdateTime = now;
		await updateActiveUsers();
	}
};

async function startRedisSubscriber() {
	const sub = redis.duplicate();
	sub.connect();

	sub.subscribe("__keyevent@0__:expired", async key => {
		if (key.startsWith("active:")) {
			// console.log("Key expired:", key);
			await throttle();
		}
	});
}

startRedisSubscriber().catch(console.error);

io.on("connection", async socket => {
	const userID = socket.handshake.auth.userID;
	const key = `active:${userID}`;

	// Immediately mark user as active
	await redis.set(key, socket.id, {
		EX: 30 // Expire in 30 seconds
	});

	socket.on("ping", async () => {
		redis.set(key, socket.id, {
			EX: 30 // Expiration in seconds
		}); // set TTL to 30 seconds
		// await updateActiveUsers();
		// console.log("PONG!", socket.handshake.auth.userID);

		await throttle();
	});

	socket.on("disconnect", async () => {
		console.log("a user disconnected:", socket.id);
	});
});

export { io, app, server };
