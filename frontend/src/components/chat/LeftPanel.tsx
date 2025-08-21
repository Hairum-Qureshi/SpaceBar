import { Link } from "react-router-dom";
import useChat from "../../hooks/useChat";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Contact from "./Contact";
import type { Conversation, User } from "../../interfaces";
import { IoMdSettings } from "react-icons/io";
import useChatStore from "../../stores/useChatStore";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useState } from "react";
import ModalForm from "./ModalForm";
import { Bounce, ToastContainer } from "react-toastify";

export default function LeftPanel() {
	const { conversations } = useChat();
	const { data: userData } = useCurrentUser();
	const { showChat, setChatVisibility } = useChatStore();
	const [open, setOpen] = useState(false);

	const onOpenModal = () => setOpen(true);
	const onCloseModal = () => setOpen(false);

	// TODO - make modal 'X' button color white

	return (
		<div
			className={`
        lg:h-screen lg:bg-zinc-950 lg:p-3 lg:flex lg:flex-col
        ${showChat ? "block" : "hidden"}
        sm:block
      `}
		>
			<ToastContainer
				position="top-right"
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
			<Modal
				open={open}
				onClose={onCloseModal}
				classNames={{
					modal:
						"text-white p-8 rounded-xl border-2 border-purple-700 max-w-lg mx-auto shadow-lg w-1/2",
					overlay: "bg-zinc-900 bg-opacity-70",
					closeIcon: "text-purple-500 hover:text-purple-400"
				}}
				styles={{
					modal: {
						backgroundColor: "#1f1b2e",
						marginTop: "8vh",
						boxShadow: "0 8px 24px rgba(102, 51, 153, 0.5)"
					}
				}}
			>
				<ModalForm onCloseModal={onCloseModal} />
			</Modal>
			<div>
				<button
					className="bg-purple-950 hover:cursor-pointer p-2 text-purple-300 border border-purple-800 my-2 w-full rounded-md"
					onClick={() => {
						onOpenModal();
					}}
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
					conversations.map((conversation: Conversation) => {
						if (conversation.isGroupChat) {
							return (
								<Link
									to={`/conversation/${conversation._id}`}
									key={conversation._id}
									onClick={() => setChatVisibility(true)}
									className="hover:cursor-pointer"
								>
									<Contact
										userID={conversation._id}
										username={conversation.groupName!}
										profilePicture={conversation.groupPhoto!}
										latestMessage={conversation.latestMessage}
										latestMessageTime={conversation.updatedAt}
										conversationID={conversation._id}
										isGroupChat={true}
									/>
								</Link>
							);
						} else {
							// Render 1-on-1 chat contact(s)
							return conversation.users
								.filter((user: User) => user._id !== userData?._id) // exclude yourself
								.map((user: User) => (
									<Link
										to={`/conversation/${conversation._id}`}
										key={`${conversation._id}-${user._id}`}
										onClick={() => setChatVisibility(true)}
										className="hover:cursor-pointer"
									>
										<Contact
											userID={user._id}
											username={user.username}
											profilePicture={user.profilePicture}
											latestMessage={conversation.latestMessage}
											latestMessageTime={conversation.updatedAt}
											conversationID={conversation._id}
											isGroupChat={false}
										/>
									</Link>
								));
						}
					})
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
