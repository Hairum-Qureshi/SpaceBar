import { create } from "zustand";
import type { ChatStoreState } from "../interfaces";

const useChatStore = create<ChatStoreState>(set => ({
	showChatInfoPanel: false,
	showChat: true,
	setChatInfoPanelVisibility: show => set({ showChatInfoPanel: show }),
	setChatVisibility: show => set({ showChat: show })
}));

export default useChatStore;
