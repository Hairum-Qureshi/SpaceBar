import useChatStore from "../../stores/useChatStore";
import Chat from "./Chat";
import ChatInfoPanel from "./ChatInfoPanel";
import useChat from "../../hooks/useChat";
import { Bounce, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function RightPanel() {
	const { showChatInfoPanel } = useChatStore();
	const { conversation } = useChat();
	const location = useLocation();

	// Decide width dynamically
	const chatAreaWidth =
		showChatInfoPanel && conversation ? "lg:w-2/3" : "lg:w-full";

	return (
		<div className="flex h-screen w-full relative">
			<ToastContainer
				position="bottom-right"
				autoClose={2000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				theme="dark"
				pauseOnHover={false}
				transition={Bounce}
			/>
			{/* Background image */}
			<img
				src="https://cdn.prod.website-files.com/6768f29a6d5da42209173f20/6768f29b6d5da4220917750d_Rectangle%20(28).svg"
				className="absolute inset-0 w-full h-full object-cover"
				alt="Background image"
			/>

			{/* Foreground content */}
			<div className="relative flex w-full h-full">
				{/* Chat area */}
				<div
					className={`flex flex-col min-h-screen max-h-screen overflow-y-auto ${chatAreaWidth}`}
				>
					{!conversation || !location.pathname.split("/").pop() ? (
						<div className="flex flex-col items-center justify-center h-full px-6 text-center">
							<h2 className="text-2xl font-semibold text-fuchsia-400 mb-4">
								No Conversation Selected
							</h2>
							<p className="max-w-md text-gray-300 text-base leading-relaxed">
								You currently don't have a conversation selected. Click on a
								contact to resume chatting, or use the{" "}
								<span className="font-semibold text-fuchsia-500">
									'Add User'
								</span>{" "}
								button to start a conversation with someone.
							</p>
						</div>
					) : (
						<Chat />
					)}
				</div>

				{/* Info panel */}
				{showChatInfoPanel && conversation && (
					<div className="block w-1/3">
						<ChatInfoPanel />
					</div>
				)}
			</div>
		</div>
	);
}
