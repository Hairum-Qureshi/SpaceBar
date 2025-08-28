import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface MessagePayload {
	createdMessageID: string;
	conversationID: string;
	username: string;
	profilePicture: string;
	message: string;
	containedImages: boolean;
}

interface SocketStore {
	socket: Socket | null;
	activeUsers: string[];
	messagePayload: MessagePayload | undefined;
	connectSocket: (userId: string) => void;
	disconnectSocket: () => void;
}

const useSocketStore = create<SocketStore>(set => ({
	socket: null,
	activeUsers: [],
	messagePayload: undefined,
	connectSocket: userID => {
		const socket = io(`${import.meta.env.VITE_BACKEND_BASE_URL}`, {
			auth: { userID }
		});

		set({ socket });

		socket.on("connect", () => {
			console.log("Connected:", socket.id);

			setInterval(() => {
				socket.emit("ping");
			}, 10000);
		});

		socket.on("activeUsers", data => {
			set({ activeUsers: data });
		});

		socket.on("newMessage", (messagePayload: MessagePayload) => {
			set({ messagePayload });

			Notification.requestPermission().then(permission => {
				if (permission === "granted") {
					new Notification(
						`@${messagePayload.username} just sent you a message!`,
						{
							body: messagePayload.message || "Sent an image",
							icon: messagePayload.profilePicture
						}
					);
				}
			});
		});

		socket.on("disconnect", () => {
			console.log("Disconnected");
		});
	},

	disconnectSocket: () => {
		const socket = useSocketStore.getState().socket;
		if (socket) {
			socket.disconnect();
			set({ socket: null });
		}
	}
}));

export default useSocketStore;
