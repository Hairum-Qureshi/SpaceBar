import { Link } from "react-router-dom";
import useChat from "../../hooks/useChat";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Contact from "./Contact";
import type { Conversation, User } from "../../interfaces";
import { IoMdSettings } from "react-icons/io";

export default function LeftPanel() {
	const { conversations, createChatMutation } = useChat();
	const { data: userData } = useCurrentUser();

	return (
		<div className="w-1/4 bg-zinc-950 p-3 min-h-screen max-h-screen flex flex-col">
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
			<div className="flex-1 overflow-y-auto mt-2 space-y-2">
				{conversations?.length > 0 ? (
					conversations.flatMap((conversation: Conversation) =>
						conversation.users
							.filter((user: User) => user._id !== userData?._id)
							.map((user: User) => (
								<Link
									to={`/conversation/${conversation._id}`}
									key={`${conversation._id}-${user._id}`}
								>
									<Contact
										userID={user._id}
										username={user.username}
										profilePicture={user.profilePicture}
										latestMessage={conversation.latestMessage}
										latestMessageTime={conversation.updatedAt}
									/>
								</Link>
							))
					)
				) : (
					<h3 className="my-10 text-slate-500 text-center">
						You currently don't have any conversations with anyone. Click the
						'add user' button to start chatting with somebody
					</h3>
				)}
			</div>
			<div className="h-10 w-full text-white text-center font-semibold mt-2 text-sm flex items-center">
				<div className="flex items-center w-full">
					<div className="w-12 h-12 rounded-full">
						<img
							src={userData?.profilePicture}
							alt="User profile picture"
							className="border border-purple-600 w-12 h-12 rounded-full object-cover"
						/>
					</div>
					<div className="ml-2 text-left">
						<h3 className="text-sm font-semibold text-fuchsia-500">
							@{userData?.username}
						</h3>
						<h3 className="text-sm font-light text-fuchsia-700">
							@{userData?.email}
						</h3>
					</div>
				</div>
				<Link to="/settings">
					<span className="text-xl ml-auto text-fuchsia-600 hover:cursor-pointer">
						<IoMdSettings />
					</span>
				</Link>
			</div>
		</div>
	);
}
