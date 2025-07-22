import { Schema, Types, model } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema(
	{
		_id: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			minLength: 6
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		profilePicture: {
			type: String,
			default:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi3ifIb3hPYy41SzdZHJjED3u0U5hWErjJog&s"
		},
		isVerified: {
			type: Boolean,
			default: false
		},
		conversations: {
			type: [String],
			ref: "Conversation",
			default: []
		}
	},
	{
		timestamps: true
	}
);

export default model<IUser>("User", userSchema);
