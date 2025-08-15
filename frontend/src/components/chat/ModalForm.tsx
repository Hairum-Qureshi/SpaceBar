import { useState } from "react";
import { Link } from "react-router-dom";
import useChat from "../../hooks/useChat";

interface ModalFormProps {
	onCloseModal: () => void;
}

export default function ModalForm({ onCloseModal }: ModalFormProps) {
	const [isCreatingGC, setIsCreatingGC] = useState(false);
	const [groupPhoto, setGroupPhoto] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [friendUID, setFriendUIID] = useState("");
	const { createChatMutation } = useChat();

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return;
		const file = e.target.files[0];
		setGroupPhoto(file);
		setPreview(URL.createObjectURL(file));
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
					<p className="text-gray-300 mb-6 leading-relaxed">
						To get your ID to share, visit your{" "}
						<Link
							to="/settings"
							className="underline cursor-pointer text-purple-400"
						>
							Settings page
						</Link>
						.
					</p>
					<label
						htmlFor="userIdInput"
						className="block text-white font-semibold mb-2"
					>
						Enter User ID
					</label>
					<input
						id="userIdInput"
						type="text"
						placeholder="User ID"
						className="w-full p-2 rounded-md text-sm bg-zinc-800 border border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-white mb-4"
						value={friendUID}
						onChange={e => setFriendUIID(e.target.value)}
					/>
					<button
						className="hover:cursor-pointer bg-pink-900 rounded-md p-2 ml-auto border border-pink-500"
						onClick={() => {
							createChatMutation(friendUID);
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
					/>
					<div className="mb-4">
						<label className="block text-white font-semibold mb-2">
							Group Photo
						</label>
						<div className="w-32 h-32 bg-zinc-800 border border-purple-700 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
							{preview ? (
								<img
									src={preview}
									alt="Group Photo Preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<span className="text-gray-400 text-sm text-center">
									Click to upload
								</span>
							)}
							<input
								type="file"
								accept="image/*"
								onChange={handlePhotoChange}
								className="absolute w-32 h-32 opacity-0 cursor-pointer"
							/>
						</div>
					</div>
					<label className="block text-white font-semibold mb-2">
						Add Users (max 10)
					</label>
					<input
						type="text"
						placeholder="Enter user IDs separated by commas"
						className="w-full p-2 rounded-md text-sm bg-zinc-800 border border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-white mb-4"
					/>

					<button className="hover:cursor-pointer bg-pink-900 border border-pink-500 rounded-md p-2 ml-auto">
						Create Group Chat
					</button>
				</div>
			)}
		</>
	);
}
