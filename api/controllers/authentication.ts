import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import generateAndSetCookie from "../utils/generateAndSetCookie";
import { IUser } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, email, password, confirmPassword } = req.body;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			res.status(400).json({ error: "Invalid email" });
			return;
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			res.status(400).json({ error: "Username already taken" });
			return;
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			res.status(400).json({ error: "Email already taken" });
			return;
		}

		if (password.length < 6) {
			res
				.status(400)
				.json({ error: "Password must be at least 6 characters long" });
			return;
		}

		if (!/\d/.test(password)) {
			res
				.status(400)
				.json({ error: "Password must contain at least one number" });
			return;
		}

		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
			res
				.status(400)
				.json({ error: "Password must contain at least one symbol" });
			return;
		}

		if (password !== confirmPassword) {
			res.status(400).json({ error: "Passwords do not match" });
			return;
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			_id: uuidv4().replace(/-/g, ""),
			username,
			password: hashedPassword,
			email
		});

		await user.save();

		generateAndSetCookie(user._id, res);
		res.status(200).json({ userData: user });
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signUp function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const signIn = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, password } = req.body;

		const user: IUser | undefined = (await User.findOne({ username })) as
			| IUser
			| undefined;
		const correctPassword = await bcrypt.compare(
			password,
			user?.password || ""
		);

		if (!user || !correctPassword) {
			res.status(401).json({ error: "Invalid username or password" });
			return;
		}

		generateAndSetCookie(user._id, res);

		res.status(200).json({ userData: user });
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signIn function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { signUp, signIn };
