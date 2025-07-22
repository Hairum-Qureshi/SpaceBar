import { Schema, Types, model } from "mongoose";
import { IConversation } from "../../interfaces";

const conversationSchema = new Schema(
	{
		_id: {
			type: String
		},
		users: [
			{
				type: String,
				ref: "User"
			}
		],
		isGroupChat: {
			type: Boolean,
			default: false
		},
		groupName: {
			type: String
		},
		groupPhoto: {
			type: String
		},
		chatTheme: {
			type: String // TODO - maybe have this an enum containing the different color gradients
		},
		chatWallpaper: {
			type: String // TODO - maybe have this as an enum containing the different wallpaper options
		},
		media: {
			type: [String],
			default: []
		},
		latestMessage: {
			type: String
		},
		messages: [
			{
				type: Types.ObjectId,
				ref: "Message",
				default: []
			}
		],
		admins: {
			type: [String],
			ref: "User"
		}
	},
	{
		timestamps: true
	}
);

export default model<IConversation>("Conversation", conversationSchema);
