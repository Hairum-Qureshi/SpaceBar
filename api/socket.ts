import { Server } from "socket.io";
import http from "http";
import express from "express";
import { redis } from "./configs/redis-config";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: [process.env.FRONTEND_URL!]
	}
});

const updateActiveUsers = async () => {
	const allActiveUsers: string[] = [];

	for await (const keys of redis.scanIterator({ MATCH: "active:*" })) {
		allActiveUsers.push(...keys.map(key => key.replace("active:", "")));
	}

	io.emit("activeUsers", allActiveUsers);
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
		// console.log("PONG!", userID);

		await throttle();
	});

	socket.on("user-logout", async () => {
		await redis.del(`active:${userID}`);
		await updateActiveUsers();

		// Optionally disconnect the socket
		socket.disconnect(true);
	});

	socket.on("user-join", async () => {
		await redis.set(`active:${userID}`, socket.id);
		await updateActiveUsers();
	});

	socket.on("disconnect", async () => {
		console.log("a user disconnected:", socket.id);
	});
});

export { io, app, server };
