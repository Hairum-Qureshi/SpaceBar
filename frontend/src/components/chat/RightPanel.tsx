import useChatStore from "../../stores/useChatStore";
import Chat from "./Chat";
import ChatInfoPanel from "./ChatInfoPanel";
import useChat from "../../hooks/useChat";

export default function RightPanel() {
	const { showChatInfoPanel } = useChatStore();
	const { conversation } = useChat();

	console.log(conversation);

	return (
		<>
			<div
				className={`${
					showChatInfoPanel && conversation ? "w-1/2 mr-auto" : "w-3/4"
				} h-screen flex`}
			>
				<img
					src="https://cdn.prod.website-files.com/6768f29a6d5da42209173f20/6768f29b6d5da4220917750d_Rectangle%20(28).svg"
					className="w-full h-full object-cover"
					alt="Background image"
				/>
				<div
					className={`absolute inset-0 flex flex-col ${
						showChatInfoPanel && conversation ? "w-1/2 mr-auto" : "w-3/4"
					} ml-auto min-h-screen max-h-screen overflow-y-auto ${
						!conversation && "flex items-center justify-center"
					}`}
				>
					{!conversation ? (
						<h2 className="text-sky-700 text-3xl text-center w-2/3">
							No conversation selected. If you have no conversations, press the
							"Add User" button to start a conversation with somebody.
						</h2>
					) : (
						<Chat />
					)}
				</div>
			</div>
			{showChatInfoPanel && conversation && <ChatInfoPanel />}
		</>
	);
}
