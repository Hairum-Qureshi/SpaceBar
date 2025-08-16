import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type {
	Conversation,
	ImageFile,
	Message,
	MinimalUserData
} from "../interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useSocketStore from "../stores/useSocketStore";
import { toast } from "react-toastify";
import { useCurrentUser } from "./useCurrentUser";

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

	function createGroupChat(
		groupChatName: string,
		groupChatPhoto: ImageFile[],
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

		// TODO - will need to add a character limit for group chat name

		if (members.includes(userData?._id)) {
			toast("You cannot add yourself to a group chat", {
				autoClose: 600,
				hideProgressBar: true,
				type: "error"
			});
			return;
		}

		if (members.split(", ").length >= 2 || members.split(",").length >= 2) {
			// create the group chat
		}
	}

	return {
		conversations,
		createChatMutation,
		conversation,
		conversationMessages,
		conversationData,
		deleteConversation
	};
}
