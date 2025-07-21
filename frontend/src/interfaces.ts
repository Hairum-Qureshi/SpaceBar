interface Conversation {
	_id: string;
	users: User[];
	isGroupChat: boolean;
	groupName: string;
	groupPhoto: string;
	chatTheme: string;
	chatWallpaper: string;
	media: string[];
	latestMessage: string;
	messages: Message[];
	admins: User[];
	createdAt: Date;
	updatedAt: Date;
}

interface User {
	_id: string;
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

interface AuthStoreState {
	currUserData: User | null;
	setCurrUserData: (userData: User) => void;
	clearUserData: () => void;
}

export type { User, Conversation, Message, AuthStoreState };
