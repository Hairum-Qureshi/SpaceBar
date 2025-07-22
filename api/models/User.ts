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
				"https://i.pinimg.com/236x/75/ae/6e/75ae6eeeeb590c066ec53b277b614ce3.jpg"
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
