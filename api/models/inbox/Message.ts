import { Schema, model } from "mongoose";
import { IMessage } from "../../interfaces";

const messageSchema = new Schema(
	{
		message: {
			type: String
		},
		sender: {
			type: String,
			ref: "User"
		},
		attachments: {
			type: [String],
			default: []
		},
		conversationID: {
			type: String,
			ref: "Conversation"
		}
	},
	{
		timestamps: true
	}
);

export default model<IMessage>("Message", messageSchema);
