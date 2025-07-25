import { FaInfoCircle } from "react-icons/fa";
import useChatStore from "../../stores/useChatStore";
import { useState } from "react";
import useChat from "../../hooks/useChat";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import type { User } from "../../interfaces";
import useSocketStore from "../../stores/useSocketStore";

export default function ChatHeader() {
	const [showInfoPanel, setShowInfoPanel] = useState(false);
	const { setChatInfoPanelVisibility } = useChatStore();
	const activeUsers = useSocketStore(state => state.activeUsers);
	const { data: userData } = useCurrentUser();
	const { conversation } = useChat();

	// TODO - add code to handle group chats
	const filteredUsers = conversation?.users?.filter(
		(user: User) => user._id !== userData?._id
	)[0];

	return (
		<div className="w-full h-12 p-2 bg-zinc-950 flex items-center text-sm">
			<div className="w-8 h-8 rounded-full">
				<img
					src={filteredUsers?.profilePicture}
					alt="User Pfp"
					className="w-8 h-8 rounded-full object-cover border border-slate-700"
				/>
			</div>
			<div className="flex flex-col ml-3">
				<h3 className="text-purple-600 leading-tight font-semibold">
					@{filteredUsers?.username}
				</h3>
				{filteredUsers &&
				filteredUsers?._id &&
				activeUsers &&
				(activeUsers as unknown as string[]).includes(filteredUsers._id) ? (
					<p className="text-green-600 leading-tight">Online</p>
				) : (
					<p className="text-red-600 leading-tight">Offline</p>
				)}
			</div>
			<div
				className="ml-auto text-lg mr-3 hover:cursor-pointer"
				onClick={() => {
					setChatInfoPanelVisibility(!showInfoPanel);
					setShowInfoPanel(!showInfoPanel);
				}}
			>
				<FaInfoCircle />
			</div>
		</div>
	);
}
