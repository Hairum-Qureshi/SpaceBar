import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImageFile } from "../interfaces";
import { dataURLToFile } from "../utils/dataURLToFile";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSocketStore from "../stores/useSocketStore";

interface UserTools {
	uploadProfilePicture: (profilePicture: ImageFile[]) => void;
	deleteAccount: () => void;
}

export default function useProfile(): UserTools {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { socket } = useSocketStore();

	const { mutate: uploadProfilePictureMutate } = useMutation({
		mutationFn: async ({ profilePicture }: { profilePicture: ImageFile[] }) => {
			try {
				const formData = new FormData();

				const res: File = await dataURLToFile(profilePicture[0].dataURL);
				formData.append("profilePicture", res);

				const response = await axios.post(
					`${
						import.meta.env.VITE_BACKEND_BASE_URL
					}/api/user/upload/profile-picture`,
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
			queryClient.invalidateQueries({ queryKey: ["currentUser"] });
		}
	});

	function uploadProfilePicture(profilePicture: ImageFile[]) {
		if (!profilePicture.length) {
			alert("No profile picture provided");
			return;
		}

		uploadProfilePictureMutate({ profilePicture });
	}

	const { mutate: deleteAccountMutation } = useMutation({
		mutationFn: async () => {
			try {
				const response = await axios.patch(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/delete/account`,
					{},
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
			queryClient.removeQueries({ queryKey: ["currentUser"] });
			socket?.emit("user-logout");
			navigate("/sign-up");
		}
	});

	function deleteAccount() {
		const confirmation = confirm(
			"Are you sure you would like to delete your account? This action cannot be undone!"
		);
		if (!confirmation) return;

		deleteAccountMutation();
	}

	return { uploadProfilePicture, deleteAccount };
}
