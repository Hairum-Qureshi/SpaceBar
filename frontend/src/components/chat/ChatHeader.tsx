import { FaInfoCircle } from "react-icons/fa";
import useChatStore from "../../stores/useChatStore";
import useChat from "../../hooks/useChat";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import type { User } from "../../interfaces";
import useSocketStore from "../../stores/useSocketStore";
import { FaArrowLeft } from "react-icons/fa6";

export default function ChatHeader() {
	const { setChatInfoPanelVisibility, setChatVisibility, showChatInfoPanel } =
		useChatStore();
	const activeUsers = useSocketStore(state => state.activeUsers);
	const { data: userData } = useCurrentUser();
	const { conversation } = useChat();

	// TODO - add code to handle group chats
	const filteredUsers = conversation?.users?.filter(
		(user: User) => user._id !== userData?._id
	)[0];

	return (
		<div className="w-full h-12 p-2 bg-zinc-950 flex items-center text-sm">
			<div
				className="text-lg mr-3 hover:cursor-pointer lg:invisible md:visible"
				onClick={() => setChatVisibility(false)}
			>
				<FaArrowLeft />
			</div>
			<div className="w-8 h-8 rounded-full">
				<img
					src={
						conversation?.isGroupChat
							? conversation?.groupPhoto
							: filteredUsers?.profilePicture
					}
					alt="User Pfp"
					className="w-8 h-8 rounded-full object-cover border border-slate-700"
				/>
			</div>
			<div className="flex flex-col ml-3">
				<h3 className="text-purple-600 leading-tight font-semibold">
					{conversation?.isGroupChat
						? conversation?.groupName
						: `@${filteredUsers?.username}`}
				</h3>
				{!conversation?.isGroupChat &&
					(filteredUsers &&
					filteredUsers?._id &&
					activeUsers &&
					(activeUsers as unknown as string[]).includes(filteredUsers._id) ? (
						<p className="text-green-600 leading-tight">Online</p>
					) : (
						<p className="text-red-600 leading-tight">Offline</p>
					))}
			</div>
			<div
				className="ml-auto text-lg mr-3 hover:cursor-pointer"
				onClick={() => {
					setChatInfoPanelVisibility(!showChatInfoPanel);
				}}
			>
				<FaInfoCircle />
			</div>
		</div>
	);
}
