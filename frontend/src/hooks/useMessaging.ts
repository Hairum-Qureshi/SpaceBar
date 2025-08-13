import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import type { ImageFile } from "../interfaces";
import { useLocation } from "react-router-dom";
import { dataURLToFile } from "../utils/dataURLToFile";

interface MessagingTools {
	sendMessage: (
		e: React.KeyboardEvent,
		userID: string,
		conversationID: string,
		images: ImageFile[]
	) => void;
	setMessage: (message: string) => void;
	message: string;
}

export default function useMessaging(): MessagingTools {
	const [message, setMessage] = useState("");
	const location = useLocation();
	const queryClient = useQueryClient();
	const [conversationID, setConversationID] = useState("");

	useEffect(() => {
		const convoID = location.pathname.split("/").pop();
		if (convoID) setConversationID(convoID);
	}, [location.pathname]);

	const { mutate: postMessageMutate } = useMutation({
		mutationFn: async ({
			message,
			userID,
			conversationID,
			images
		}: {
			message: string;
			userID: string;
			conversationID: string;
			images: ImageFile[];
		}) => {
			try {
				const formData = new FormData();
				formData.append("conversationID", conversationID); // move it here before the image data being appended!
				formData.append("imagesSent", !images.length ? "false" : "true");

				if (images.length) {
					for (let i = 0; i < images.length; i++) {
						const res: File = await dataURLToFile(images[i].dataURL);
						formData.append("images", res);
					}
				}

				formData.append("message", message);
				formData.append("userID", userID);

				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/message/send`,
					formData,
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error posting:", error);
				throw new Error("Failed to send message");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["messages", conversationID]
			});
			queryClient.invalidateQueries({
				queryKey: ["conversationData", conversationID]
			});
		}
	});

	function sendMessage(
		e: React.KeyboardEvent,
		userID: string,
		conversationID: string,
		images: ImageFile[]
	) {
		if (e.key === "Enter" && e.shiftKey) {
			return;
		}

		if (e.key === "Enter") {
			e.preventDefault();

			if (!images.length && !message?.trim()) {
				alert("Message cannot be empty");
				return;
			}

			// queryClient.setQueryData(
			// 	["messages", conversationID],
			// 	(prevMessages: Message[] = []) => [
			// 		...prevMessages,
			// 		{
			// 			message,
			// 			sender: {
			// 				_id: userData._id,
			// 				username: userData.username,
			// 				profilePicture: userData.profilePicture
			// 			},
			// 			attachments: [],
			// 			conversationID,
			// 			createdAt: new Date()
			// 		}
			// 	]
			// );

			postMessageMutate({ message, userID, conversationID, images });
			setMessage("");
		}
	}

	return { sendMessage, setMessage, message };
}
