// stores/useSocketStore.ts
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketStore {
	socket: Socket | null;
	connectSocket: (userId: string) => void;
	disconnectSocket: () => void;
}

const useSocketStore = create<SocketStore>(set => ({
	socket: null,

	connectSocket: userID => {
		const socket = io("http://localhost:3000", {
			auth: { userID } // if you're sending auth info
		});

		set({ socket });

		// Optionally: handle events globally here
		socket.on("connect", () => {
			console.log("Connected:", socket.id);
		});

		socket.on("disconnect", () => {
			console.log("Disconnected");
		});

		// Add your custom event handlers here (e.g., messages, heartbeats)
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
