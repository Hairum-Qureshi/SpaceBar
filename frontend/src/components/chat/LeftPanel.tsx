import { Link } from "react-router-dom";
import useChat from "../../hooks/useChat";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import type { Conversation, User } from "../../interfaces";
import Contact from "./Contact";

export default function LeftPanel() {
	const { conversations, createChatMutation } = useChat();
	const { data: userData } = useCurrentUser();

	return (
		<div className="w-1/4 bg-zinc-950 p-3 min-h-screen max-h-screen overflow-y-auto">
			<div>
				<button
					className="bg-purple-950 hover:cursor-pointer p-2 text-purple-300 border border-purple-800 my-2 w-full rounded-md"
					onClick={() => createChatMutation()}
				>
					Add User
				</button>
				<input
					type="text"
					className="p-2 w-full bg-transparent rounded-md text-base outline-none text-gray-400 border-2 border-gray-800 mt-2"
					placeholder="Search User"
				/>
			</div>
			<div>
				{conversations?.length > 0 ? (
					conversations?.map((conversation: Conversation) => {
						{
							return conversation.users.map((user: User) => {
								if (user._id !== userData?._id) {
									return (
										<Link to={`/conversation/${conversation._id}`}>
											<Contact
												userID={user._id}
												username={user.username}
												profilePicture={user.profilePicture}
												latestMessage={conversation.latestMessage}
												latestMessageTime={conversation.updatedAt}
											/>
										</Link>
									);
								}
							});
						}
					})
				) : (
					<h3 className="my-10 text-slate-500 text-center">
						You currently don't have any conversations with anyone. Click the
						'add user' button to start chatting with somebody
					</h3>
				)}
			</div>
		</div>
	);
}
