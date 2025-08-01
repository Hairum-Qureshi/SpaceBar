import useChat from "../../hooks/useChat";
import type { MinimalUserData } from "../../interfaces";
import { FaDownload } from "react-icons/fa6";
import { saveAs } from "file-saver";

export default function ChatInfoPanel() {
	const { conversationData } = useChat();

	const handleDownload = async (imageURL: string) => {
		try {
			const response = await fetch(imageURL); // URL string
			const blob = await response.blob(); // convert to Blob
			saveAs(blob, "image.jpg"); // ✅ now valid
		} catch (err) {
			console.error("Failed to download image:", err);
		}
	};

	return (
		<div className="w-1/4 text-white h-screen ml-auto overflow-hidden bg-zinc-950 border-l-2 border-l-purple-800 flex flex-col">
			<div className="flex-shrink-0">
				<h3 className="text-slate-300 font-semibold text-xl text-center mt-5">
					Members
				</h3>
				<div className="max-h-48 overflow-y-auto">
					{conversationData?.conversationMembers.map(
						(user: MinimalUserData) => {
							return (
								<div key={user._id} className="w-full p-2 flex items-center">
									<div className="w-8 h-8 rounded-full">
										<img
											src={user.profilePicture}
											alt={`User ${user.username} Profile Picture`}
											className="w-8 h-8 rounded-full object-cover border border-purple-700"
										/>
									</div>
									<div className="ml-3">@{user.username}</div>
								</div>
							);
						}
					)}
				</div>
			</div>
			<div className="flex-grow overflow-y-auto px-2 py-2">
				<h4 className="text-slate-300 font-semibold text-lg mb-5 text-center">
					Uploaded Images
				</h4>
				<div className="grid grid-cols-2 gap-2 w-full">
					{conversationData?.conversationImages?.length ? (
						conversationData.conversationImages.map((imageObj, i) =>
							(imageObj.attachments as unknown as string[]).map((image, j) => (
								<div className="relative w-40 h-40" key={`${i}-${j}`}>
									<img
										src={image}
										alt={`Uploaded image ${i}-${j}`}
										className="w-full h-full rounded-md object-cover border border-purple-600"
									/>
									<span
										className="absolute bottom-1 right-1 p-1 rounded-md bg-black hover:cursor-pointer"
										onClick={async () => await handleDownload(image)}
									>
										<FaDownload />
									</span>
								</div>
							))
						)
					) : (
						<div className="col-span-2 flex justify-center items-center w-full py-10">
							<h2 className="text-purple-700 font-semibold">
								There are currently no images uploaded
							</h2>
						</div>
					)}
				</div>
			</div>
			<div className="flex-shrink-0 p-4 border-t border-white">
				<button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded hover:cursor-pointer">
					Block User
				</button>
			</div>
		</div>
	);
}
