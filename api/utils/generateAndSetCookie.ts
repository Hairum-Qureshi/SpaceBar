import jwt from "jsonwebtoken";
import { Response } from "express";

export default function generateAndSetCookie(
	uid: string,
	res: Response
): Response {
	const token = jwt.sign({ uid }, process.env.JWT_SECRET!, {
		expiresIn: "15d"
	});
	res.cookie("auth-token", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development"
	});

	return res;
}
