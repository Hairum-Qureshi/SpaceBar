interface Conversation {
	_id: string;
	users: User[];
	isGroupChat: boolean;
	groupName?: string;
	groupPhoto?: string;
	chatTheme?: string;
	chatWallpaper?: string;
	media: string[];
	latestMessage: string;
	messages: Message[];
	admins: User[] | string[];
	createdAt: Date;
	updatedAt: Date;
}

interface User {
	_id?: string;
	username: string;
	password?: string;
	email: string;
	profilePicture: string;
	isVerified: boolean;
	conversations: Conversation[];
	createdAt: Date;
	updatedAt: Date;
}

interface Message {
	message: string;
	sender: User;
	attachments: string[];
	conversationID: string;
	createdAt: Date;
	updatedAt: Date;
}

interface ChatStoreState {
	showChatInfoPanel: boolean;
	setChatInfoPanelVisibility: (show: boolean) => void;
}

interface ImageFile {
	dataURL: string;
	file: File;
}

interface MinimalUserData {
	_id: string;
	username: string;
	profilePicture: string;
	isVerified: boolean;
}

export type {
	User,
	Conversation,
	Message,
	ChatStoreState,
	ImageFile,
	MinimalUserData
};
