import { Types } from "mongoose";

interface IMessage {
	message: string;
	sender: Types.ObjectId;
	attachments: string[];
	conversationID: string;
	createdAt: Date;
	updatedAt: Date;
}

interface IConversation {
	_id: string;
	users: string[];
	isGroupChat: boolean;
	groupName: string;
	groupPhoto: string;
	chatTheme: string; // TODO - maybe have this an enum containing the different color gradients
	chatWallpaper: string; // TODO - maybe have this as an enum containing the different wallpaper options
	media: string[];
	latestMessage: string;
	messages: IMessage[];
	admins: Types.ObjectId[];
	groupChatPhotoImageID: string;
	createdAt: Date;
	updatedAt: Date;
}

interface IUser {
	_id: string;
	username: string;
	password: string;
	email: string;
	profilePicture: string;
	isVerified: boolean;
	conversations: IConversation[];
	pfpImageID: string;
	createdAt: Date;
	updatedAt: Date;
}

interface MinimalUserData {
	_id: string;
	username: string;
	profilePicture: string;
	isVerified: boolean;
}

interface FileUploadData {
	FOLDER_PATH: string;
	fileName: string;
	fileBuffer: Buffer;
	imageID: string;
	conversationID?:string;
}

export { IUser, IConversation, IMessage, MinimalUserData, FileUploadData };
