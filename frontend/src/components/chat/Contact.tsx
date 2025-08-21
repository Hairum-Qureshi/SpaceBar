import activeStatus from "../../assets/green-live-pulse.gif";
import useChat from "../../hooks/useChat";
import type { ContactProps } from "../../interfaces";
import useSocketStore from "../../stores/useSocketStore";
import { FaTrash } from "react-icons/fa";

// TODO - make sure to truncate the latest message
// TODO - have Moment.js format the latestMessageTime so it's in the form of: hh:mm AM/PM

export default function Contact({
	userID,
	profilePicture,
	username,
	latestMessage,
	latestMessageTime,
	conversationID,
	isGroupChat
}: ContactProps) {
	const activeUsers = useSocketStore(state => state.activeUsers);
	const { deleteConversation } = useChat();

	return (
		<div className="border border-gray-800 rounded-sm my-4 p-2 text-white hover:cursor-pointer hover:bg-slate-900">
			<div className="flex items-center">
				<div className="w-10 h-10 rounded-full">
					<img
						src={profilePicture}
						alt="User Pfp"
						className="w-10 h-10 rounded-full object-cover border border-slate-800"
					/>
				</div>
				<div className="text-sm ml-2 text-gray-500">
					<p>{isGroupChat ? username : `@${username}`}</p>
					<p className="text-gray-600 italic">
						{latestMessage ? latestMessage : "Be the first to start talking"}
					</p>
				</div>
				<div className="flex ml-auto items-center">
					{latestMessage && (
						<div className="ml-auto text-gray-500 text-sm">
							{latestMessageTime.toISOString()}
						</div>
					)}

					<div className="flex ml-auto flex-col items-center justify-center">
						{latestMessage && (
							<div className="mb-1 text-gray-500 text-sm">
								{latestMessageTime.toISOString()}
							</div>
						)}

						<div className="flex flex-col items-center justify-start gap-1">
							{/* Kebab at the top */}

							{!isGroupChat &&
								(activeUsers && userID && activeUsers.includes(userID) ? (
									<>
										<FaTrash
											className="text-red-700 font-bold text-sm mb-2 hover:cursor-pointer hover:text-red-500"
											onClick={() => deleteConversation(conversationID)}
										/>
										<div className="w-4 h-4 rounded-full">
											<img
												src={activeStatus}
												alt="Activity bubble"
												className="w-4 h-4 rounded-full object-cover"
											/>
										</div>
									</>
								) : (
									<>
										<FaTrash
											className="text-red-700 font-bold text-sm mb-2 hover:cursor-pointer hover:text-red-500"
											onClick={() => deleteConversation(conversationID)}
										/>
										<div className="w-2 h-2 rounded-full bg-red-600" />
									</>
								))}
							{isGroupChat && (
								<FaTrash
									className="text-red-700 font-bold text-sm mb-2 hover:cursor-pointer hover:text-red-500"
									onClick={() => deleteConversation(conversationID)}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
