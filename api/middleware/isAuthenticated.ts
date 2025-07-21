import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../interfaces";
import User from "../models/User";

export default async function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.cookies["auth-token"];

		if (!token) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		if (!decoded) {
			res.status(401).json({ message: "Invalid token" });
			return;
		}

		const user: IUser = (await User.findById({ _id: decoded.uid }).select(
			"-password -__v"
		)) as IUser;

		if (!user) {
			res.status(401).json({ message: "User not found" });
			return;
		}

		req.user = user;

		next();
	} catch (error) {
		console.error(
			"Error in checkAuthStatus.ts middleware file".red.bold,
			error
		);
	}
}
