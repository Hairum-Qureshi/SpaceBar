import TextareaAutosize from "react-textarea-autosize";
import { LuSend } from "react-icons/lu";
import { FaRegImage } from "react-icons/fa6";
import useMessaging from "../../hooks/useMessaging";
import useChat from "../../hooks/useChat";
import type { ImageFile, User } from "../../interfaces";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import UploadedImage from "./UploadedImage";
import ImageUploading, { type ImageListType } from "react-images-uploading";
import { useState } from "react";

// ! for some reason, when you send a text, the UI sorta glitches? It might have to do with the rendering logic for the chat bubbles maybe

export default function ChatFooter() {
	const { sendMessage, setMessage, message } = useMessaging();
	const { conversation } = useChat();
	const { data: userData } = useCurrentUser();
	const [images, setImages] = useState<ImageFile[]>([]);

	const onChange = (imageList: ImageListType) => {
		setImages(imageList as ImageFile[]);
	};

	// TODO - add code to handle group chats
	const filteredUsers = conversation?.users?.filter(
		(user: User) => user._id !== userData?._id
	)[0];

	return (
		<div className="w-full absolute bottom-0 p-3 bg-zinc-950 border-t border-t-fuchsia-500">
			{!!images.length && (
				<div className="flex items-center mb-3 relative">
					<ImageUploading
						multiple
						value={images}
						onChange={onChange}
						maxNumber={4}
					>
						{({ imageList, onImageRemove }) => (
							<>
								{imageList.map((image, index) => (
									<UploadedImage
										imageSrc={image.dataURL!}
										key={index}
										onImageRemove={onImageRemove}
										index={index}
									/>
								))}
							</>
						)}
					</ImageUploading>
				</div>
			)}
			<div className="flex items-center">
				<TextareaAutosize
					autoFocus
					minRows={1}
					maxRows={4}
					className="p-2 text-sm outline-none border border-purple-700 w-full rounded-sm resize-none focus:outline-blue-500 placeholder:text-purple-800"
					data-gramm="false"
					data-gramm_editor="false"
					data-enable-grammarly="false"
					placeholder="Enter a message..."
					value={message}
					onChange={e => setMessage(e.target.value)}
					onKeyDown={e => {
						if (filteredUsers._id) {
							sendMessage(e, filteredUsers._id, conversation._id, images);
							setImages([]);
						}
					}}
				/>
				<ImageUploading
					multiple
					value={images}
					onChange={onChange}
					maxNumber={4}
				>
					{({ onImageUpload }) => (
						<>
							<div
								className="p-2 text-lg border border-purple-700 rounded-md mx-2 hover:cursor-pointer text-fuchsia-500 font-bold"
								onClick={onImageUpload}
							>
								<FaRegImage />
							</div>
						</>
					)}
				</ImageUploading>
				<div
					className="p-2 text-lg border border-purple-700 rounded-md hover:cursor-pointer text-fuchsia-500"
					onClick={e => {
						if (filteredUsers._id) {
							sendMessage(e, filteredUsers._id, conversation._id, images);
							setImages([]);
						}
					}}
				>
					<LuSend />
				</div>
			</div>
		</div>
	);
}
