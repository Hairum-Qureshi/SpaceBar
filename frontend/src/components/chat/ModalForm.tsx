import { useState } from "react";
import { Link } from "react-router-dom";
import useChat from "../../hooks/useChat";
import ImageUploading, { type ImageListType } from "react-images-uploading";

interface ModalFormProps {
	onCloseModal: () => void;
}

export default function ModalForm({ onCloseModal }: ModalFormProps) {
	const [isCreatingGC, setIsCreatingGC] = useState(false);
	const [groupChatPhoto, setGroupChatPhoto] = useState<ImageListType>([]);
	const [groupChatName, setGroupChatName] = useState("");
	const [groupChatMembers, setGroupChatMembers] = useState("");

	const [friendUsername, setFriendUsername] = useState("");
	const { createChatMutation } = useChat();

	const onChange = (imageList: ImageListType) => {
		console.log("imageList", imageList);
		setGroupChatPhoto(imageList);
	};

	return (
		<>
			<div className="flex items-center mb-4">
				<span className="text-white font-medium mr-2 text-sm">
					Make it a group chat
				</span>
				<button
					type="button"
					onClick={() => setIsCreatingGC(!isCreatingGC)}
					className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none hover:cursor-pointer ${
						isCreatingGC ? "bg-purple-500" : "bg-gray-700"
					}`}
				>
					<span
						className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
							isCreatingGC ? "translate-x-5" : "translate-x-0"
						}`}
					/>
				</button>
			</div>
			{!isCreatingGC ? (
				<div className="flex flex-col">
					{/* <p className="text-gray-300 mb-6 leading-relaxed">
						To get your ID to share, visit your{" "}
						<Link
							to="/settings"
							className="underline cursor-pointer text-purple-400"
						>
							Settings page
						</Link>
						.
					</p> */}
					<label
						htmlFor="userIdInput"
						className="block text-white font-semibold mb-2"
					>
						Enter Username
					</label>
					<input
						id="userIdInput"
						type="text"
						placeholder="Username"
						className="w-full p-2 rounded-md text-sm bg-zinc-800 border border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-white mb-4"
						value={friendUsername}
						onChange={e => setFriendUsername(e.target.value)}
					/>
					<button
						className="hover:cursor-pointer bg-pink-900 rounded-md p-2 ml-auto border border-pink-500"
						onClick={() => {
							createChatMutation(friendUsername);
							onCloseModal();
						}}
					>
						Create Chat
					</button>
				</div>
			) : (
				<div className="flex flex-col">
					<label className="block text-white font-semibold mb-2">
						Group Name
					</label>
					<input
						type="text"
						placeholder="Enter group name"
						className="w-full p-2 rounded-md text-sm bg-zinc-800 border border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-white mb-4"
						value={groupChatName}
						onChange={e => setGroupChatName(e.target.value)}
					/>
					<div className="mb-4">
						<label className="block text-white font-semibold mb-2">
							Group Photo
						</label>
						<div className="w-32 h-32 bg-zinc-800 border border-purple-700 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
							<ImageUploading
								multiple={false} // you want only 1 image
								value={groupChatPhoto}
								onChange={onChange}
								maxNumber={1}
								dataURLKey="dataURL"
							>
								{({ onImageUpload, onImageRemoveAll }) => (
									<div
										className="w-full h-full"
										style={{ cursor: "pointer" }}
										onClick={() => {
											onImageRemoveAll();
											onImageUpload();
										}}
									>
										<img
											src={
												groupChatPhoto?.[0]?.dataURL ||
												"https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
											}
											alt="User profile"
											className="w-full h-full object-cover"
										/>
									</div>
								)}
							</ImageUploading>
						</div>
					</div>
					<label className="block text-white font-semibold mb-2">
						Add Users (max 10)
					</label>
					<input
						type="text"
						placeholder="Enter user IDs separated by commas"
						className="w-full p-2 rounded-md text-sm bg-zinc-800 border border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-white mb-4"
						value={groupChatMembers}
						onChange={e => setGroupChatMembers(e.target.value)}
					/>

					<button className="hover:cursor-pointer bg-pink-900 border border-pink-500 rounded-md p-2 ml-auto">
						Create Group Chat
					</button>
				</div>
			)}
		</>
	);
}
