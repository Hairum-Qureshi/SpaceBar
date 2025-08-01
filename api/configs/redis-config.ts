import * as Redis from "redis";
import dotenv from "dotenv";

dotenv.config();

const redis = Redis.createClient({
	url: process.env.REDIS_URL
});

redis.on("error", err => {
	console.error("Redis error:", err);
});

const startRedis = (async () => {
	await redis.connect();
	await redis.configSet("notify-keyspace-events", "Ex");
	console.log(
		"Connected to".yellow.bold,
		"Redis".red.bold,
		"and set keyspace notifications".yellow.bold
	);
})();

export { redis, startRedis };
