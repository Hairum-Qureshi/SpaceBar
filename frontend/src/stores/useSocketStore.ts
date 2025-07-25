import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketStore {
	socket: Socket | null;
	activeUsers: string[];
	connectSocket: (userId: string) => void;
	disconnectSocket: () => void;
}

const useSocketStore = create<SocketStore>(set => ({
	socket: null,
	activeUsers: [],

	connectSocket: userID => {
		const socket = io("http://localhost:3000", {
			auth: { userID } // if you're sending auth info
		});

		if (socket.connected) set({ socket });

		socket.on("connect", () => {
			console.log("Connected:", socket.id);

			setInterval(() => {
				socket.emit("ping");
			}, 10000);
		});

		socket.on("activeUsers", data => {
			set({ activeUsers: data });
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
