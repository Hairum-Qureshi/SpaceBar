import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import generateAndSetCookie from "../utils/generateAndSetCookie";
import { v4 as uuidv4 } from "uuid";
import admin from "../configs/firebase/firebase-config";
import crypto from "crypto";

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

		if (email.endsWith("@gmail.com")) {
			res.status(400).json({
				error: "Please sign in with Google instead of using email and password"
			});
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
		const { email, password } = req.body;

		if (!email) {
			res.status(400).json({ error: "Email is required" });
			return;
		}

		if (!password) {
			res.status(400).json({ error: "Password is required" });
			return;
		}

		const user = await User.findOne({ email });

		if (!user) {
			res.status(401).json({ error: "Invalid email or password" });
			return;
		}

		const correctPassword = await bcrypt.compare(password, user.password);

		if (!correctPassword) {
			res.status(401).json({ error: "Invalid email or password" });
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

const signOut = async (req: Request, res: Response) => {
	try {
		const currUID = req.user._id;
		res
			.cookie("auth-token", "", {
				maxAge: 0
			})
			.status(200)
			.json({
				message: "Logged out successfully"
			});
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signOut function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

async function handleFirebaseGoogleAuth(
	authFor: string,
	res: Response,
	req: Request
) {
	const tokenHeader = req.headers.authorization;

	if (!tokenHeader) {
		res.status(400).send("Invalid token or no token found");
		return;
	}

	if (!tokenHeader) {
		res.status(400).send("Invalid token or no token found");
		return;
	}

	const decodedToken = await admin
		.auth()
		.verifyIdToken(tokenHeader.replace("Bearer ", ""));

	// Check if the user already exists in the database
	let user = await User.findOne({ email: decodedToken.email });

	if (user) {
		generateAndSetCookie(user._id, res);
		res.status(200).json({ userData: user });
		return;
	}

	if (!user || authFor === "signUp") {
		// generate a random password and hash it
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(
			crypto.randomBytes(40).toString("base64"),
			salt
		);

		user = new User({
			_id: decodedToken.uid,
			email: decodedToken.email,
			username:
				decodedToken.name.replaceAll(" ", "-").toLowerCase() +
				uuidv4().slice(0, 8),
			profilePicture: decodedToken.picture,
			password: hashedPassword
		});

		await user.save();

		generateAndSetCookie(user._id, res);

		res.status(200).json({ userData: user });
	}
}

const signInWithGoogle = async (req: Request, res: Response): Promise<void> => {
	try {
		await handleFirebaseGoogleAuth("signIn", res, req);
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signInWithGoogle function controller"
				.red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const signUpWithGoogle = async (req: Request, res: Response): Promise<void> => {
	try {
		await handleFirebaseGoogleAuth("signUp", res, req);
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signUpWithGoogle function controller"
				.red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { signUp, signIn, signOut, signInWithGoogle, signUpWithGoogle };
