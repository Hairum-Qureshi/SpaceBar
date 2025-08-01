import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useSocketStore from "../stores/useSocketStore";
import type { User } from "../interfaces";

interface AuthTools {
	signUp: (
		event: React.FormEvent,
		username: string,
		email: string,
		password: string,
		confirmPassword: string
	) => void;
	signIn: (
		event: React.FormEvent,
		username: string,
		email: string,
		password: string
	) => void;
	signOut: () => void;
	signUpIsPending: boolean;
	signInIsPending: boolean;
	signOutIsPending: boolean;
}

export default function useAuth(): AuthTools {
	const navigate = useNavigate();
	const { socket, connectSocket } = useSocketStore();
	const queryClient = useQueryClient();

	const {
		mutate: signUpMutate,
		// isError: isSignUpError,
		isPending: signUpIsPending
		// error: signUpError
	} = useMutation({
		mutationFn: async ({
			username,
			email,
			password,
			confirmPassword
		}: {
			username: string;
			email: string;
			password: string;
			confirmPassword: string;
		}) => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-up`,
					{
						username,
						email,
						password,
						confirmPassword
					},
					{
						withCredentials: true
					}
				);

				return response;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true
					});
				}
			}
		},
		onSuccess: () => {
			const userData: User | undefined = queryClient.getQueryData([
				"currentUser"
			]);

			if (userData && userData?._id) {
				connectSocket(userData?._id);
			}

			socket?.emit("user-join");
			navigate("/");
		}
	});

	const {
		mutate: signInMutate,
		// isError: isSignInError,
		isPending: signInIsPending
		// error: signInError
	} = useMutation({
		mutationFn: async ({
			username,
			email,
			password
		}: {
			username: string;
			email: string;
			password: string;
		}) => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-in`,
					{ username, email, password },
					{
						withCredentials: true
					}
				);

				return response;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true
					});
				}
			}
		},
		onSuccess: () => {
			const userData: User | undefined = queryClient.getQueryData([
				"currentUser"
			]);

			if (userData && userData?._id) {
				connectSocket(userData?._id);
			}

			socket?.emit("user-join");
			navigate("/");
		}
	});

	function signUp(
		event: React.FormEvent,
		username: string,
		email: string,
		password: string,
		confirmPassword: string
	) {
		event.preventDefault();

		if (!username || !email || !password || !confirmPassword) {
			toast("Please fill in all fields", {
				autoClose: 700,
				hideProgressBar: true
			});
			return;
		}

		if (password !== confirmPassword) {
			toast("Passwords do not match", {
				autoClose: 700,
				hideProgressBar: true
			});
		}

		if (password.length < 6) {
			toast("Password must be at least 6 characters long", {
				autoClose: 700,
				hideProgressBar: true
			});
			return;
		}

		if (!/\d/.test(password)) {
			toast("Password must contain at least one number", {
				autoClose: 700,
				hideProgressBar: true
			});
			return;
		}

		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
			toast("Password must contain at least one symbol", {
				autoClose: 700,
				hideProgressBar: true
			});
			return;
		}

		if (password !== confirmPassword) {
			toast("Passwords do not match", {
				autoClose: 700,
				hideProgressBar: true
			});
			return;
		}

		signUpMutate({ username, email, password, confirmPassword });
	}

	function signIn(
		event: React.FormEvent,
		username: string,
		email: string,
		password: string
	) {
		event.preventDefault();

		if (!username || !email || !password) {
			toast("Please fill in all fields", {
				autoClose: 700,
				hideProgressBar: true
			});
		} else {
			signInMutate({ username, email, password });
		}
	}

	const {
		mutate: signOutMutate,
		// isError: isSignUpError,
		isPending: signOutIsPending
		// error: signUpError
	} = useMutation({
		mutationFn: async () => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-out`,
					{},
					{
						withCredentials: true
					}
				);

				return response;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true
					});
				}
			}
		},
		onSuccess: () => {
			navigate("/sign-up");
			socket?.emit("user-logout");
			queryClient.removeQueries({ queryKey: ["currentUser"] });
		}
	});

	function signOut() {
		signOutMutate();
	}

	return {
		signUp,
		signIn,
		signOut,
		signUpIsPending,
		signInIsPending,
		signOutIsPending
	};
}
