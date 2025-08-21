import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Conversation, Message, MinimalUserData } from "../interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useSocketStore from "../stores/useSocketStore";
import { toast } from "react-toastify";
import { useCurrentUser } from "./useCurrentUser";
import type { ImageListType } from "react-images-uploading";
import { dataURLToFile } from "../utils/dataURLToFile";

interface ChatTools {
	conversations: Conversation[];
	createChatMutation: (username: string) => void;
	conversation: Conversation;
	conversationMessages: Message[];
	conversationData: {
		conversationImages: {
			attachments: string;
		}[];
		conversationMembers: MinimalUserData[];
	};
	deleteConversation: (conversationID: string) => void;
	createGroupChat: (
		groupChatName: string,
		groupChatPhoto: ImageListType,
		members: string
	) => void;
}

export default function useChat(): ChatTools {
	const queryClient = useQueryClient();
	const location = useLocation();
	const [conversationID, setConversationID] = useState("");
	const { messagePayload } = useSocketStore();
	const navigate = useNavigate();
	const { data: userData } = useCurrentUser();

	useEffect(() => {
		const convoID = location.pathname.split("/").pop();
		if (convoID) setConversationID(convoID);
	}, [location.pathname]);

	const { data: conversations } = useQuery({
		queryKey: ["conversations"],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/conversation/all`,
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error(error);
			}
		}
	});

	const { data: conversation } = useQuery({
		queryKey: ["conversation", conversationID],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/conversation/${conversationID}`,
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error(error);
			}
		}
	});

	const { data: conversationMessages } = useQuery({
		queryKey: ["messages", conversationID],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/conversation/${conversationID}/messages`,
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error(error);
			}
		}
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async ({ username }: { username: string }) => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/conversation/create`,
					{ username },
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error creating conversation:", error);
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true,
						type: "error"
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true,
						type: "error"
					});
				}
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	const createChatMutation = (username: string) => {
		if (!username) {
			toast("Missing username", {
				autoClose: 600,
				hideProgressBar: true,
				type: "error"
			});
			return;
		}

		mutate({ username });
	};

	const lastMessageIdRef = useRef<string | null>(null);
	useEffect(() => {
		if (
			messagePayload &&
			messagePayload.createdMessageID !== lastMessageIdRef.current
		) {
			// queryClient.invalidateQueries({
			// 	queryKey: ["messages", messagePayload.conversationID]
			// });

			lastMessageIdRef.current = messagePayload.createdMessageID;
		}
	}, [messagePayload]);

	const { data: conversationData } = useQuery({
		queryKey: ["conversationData", conversationID],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/conversation/${conversationID}/data`,
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error(error);
			}
		}
	});

	const { mutate: deleteConversationMutation } = useMutation({
		mutationFn: async ({ conversationID }: { conversationID: string }) => {
			try {
				const response = await axios.delete(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/conversation/${conversationID}/remove`,
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error deleting conversation:", error);
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true,
						type: "error"
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true,
						type: "error"
					});
				}
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			navigate("/");
		}
	});

	function deleteConversation(conversationID: string) {
		const confirmation = confirm(
			"Are you sure you want to delete this conversation?"
		);

		if (!confirmation) return;

		deleteConversationMutation({ conversationID });
	}

	const { mutate: createGroupChatMutation } = useMutation({
		mutationFn: async ({
			groupChatName,
			groupChatPhoto,
			members
		}: {
			groupChatName: string;
			groupChatPhoto: ImageListType;
			members: string;
		}) => {
			try {
				const formData = new FormData();

				const res: File = await dataURLToFile(
					(groupChatPhoto as ImageListType)[0].dataURL!,
					userData._id,
					"groupChat"
				);

				formData.append("groupChatPhoto", res);
				formData.append("groupChatName", groupChatName);
				formData.append("members", members);

				const response = await axios.post(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/conversation/create/group-chat`,
					formData,
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (error) {
				console.error("Error sending message:", error);
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true,
						type: "error"
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true,
						type: "error"
					});
				}
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});

	function createGroupChat(
		groupChatName: string,
		groupChatPhoto: ImageListType,
		members: string
	) {
		if (!groupChatName || !groupChatPhoto.length || !members) {
			toast("Please fill in all fields", {
				autoClose: 600,
				hideProgressBar: true,
				type: "error"
			});
			return;
		}

		if (!members.includes(",")) {
			toast("Please make sure you're using a comma separated list", {
				autoClose: 600,
				hideProgressBar: true,
				type: "error"
			});
			return;
		}

		// TODO - will need to add a character limit for group chat name

		if (members.includes(userData?.username)) {
			toast("You cannot add yourself to a group chat", {
				autoClose: 600,
				hideProgressBar: true,
				type: "error"
			});
			return;
		}

		const memberList = members
			.split(",")
			.map(m => m.trim())
			.filter(Boolean); // remove empty strings

		if (memberList.length < 2) {
			toast("Please add at least 2 members to the group chat", {
				autoClose: 600,
				hideProgressBar: true,
				type: "error"
			});
			return;
		}

		if (memberList.length > 10) {
			toast("Please add no more than 10 members to the group chat", {
				autoClose: 600,
				hideProgressBar: true,
				type: "error"
			});
			return;
		}

		if (members.split(", ").length >= 2 || members.split(",").length >= 2) {
			// create the group chat
			createGroupChatMutation({
				groupChatName,
				groupChatPhoto,
				members
			});
		}
	}

	return {
		conversations,
		createChatMutation,
		conversation,
		conversationMessages,
		conversationData,
		deleteConversation,
		createGroupChat
	};
}
