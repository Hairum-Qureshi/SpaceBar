import { Types } from "mongoose";

interface IMessage {
	message: string;
	sender: Types.ObjectId;
	attachments: string[];
	conversationID: string;
}

interface IConversation {
	_id: string;
	users: Types.ObjectId[];
	isGroupChat: boolean;
	groupName: string;
	groupPhoto: string;
	chatTheme: string; // TODO - maybe have this an enum containing the different color gradients
	chatWallpaper: string; // TODO - maybe have this as an enum containing the different wallpaper options
	media: string[];
	latestMessage: string;
	messages: IMessage[];
	admins: Types.ObjectId[];
}

interface IUser {
	_id: string;
	username: string;
	fullName: string;
	password: string;
	email: string;
	profilePicture: string;
	isVerified: boolean;
	conversations: IConversation[];
}

export { IUser, IConversation, IMessage };
