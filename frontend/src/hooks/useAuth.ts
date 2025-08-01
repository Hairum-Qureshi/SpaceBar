import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useSocketStore from "../stores/useSocketStore";
import type { User } from "../interfaces";
import { useState } from "react";

interface FormErrors {
	usernameFieldError?: boolean;
	emailFieldError: boolean;
	passwordFieldError: boolean;
	confirmPasswordFieldError?: boolean;
}

interface AuthTools {
	signUp: (
		event: React.FormEvent,
		username: string,
		email: string,
		password: string,
		confirmPassword: string
	) => void;
	signIn: (event: React.FormEvent, email: string, password: string) => void;
	signOut: () => void;
	signUpIsPending: boolean;
	signInIsPending: boolean;
	signOutIsPending: boolean;
	validator: (password: string, confirmPassword?: string) => void;
	passContainsNumsAndSymbols: boolean;
	passwordLengthValid: boolean;
	formErrors: FormErrors;
	passwordsMatch: boolean;
}

export default function useAuth(): AuthTools {
	const navigate = useNavigate();
	const { socket, connectSocket } = useSocketStore();
	const queryClient = useQueryClient();
	const [passContainsNumsAndSymbols, setPassContainsNumsAndSymbols] =
		useState(false);
	const [passwordLengthValid, setPasswordLengthValid] = useState(false);
	const [formErrors, setFormErrors] = useState<FormErrors>({
		usernameFieldError: false,
		emailFieldError: false,
		passwordFieldError: false,
		confirmPasswordFieldError: false
	});
	const [passwordsMatch, setPasswordsMatch] = useState(false);

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
						hideProgressBar: true,
						type: "error"
					});
					if (error.response?.data.error === "Username already taken") {
						setFormErrors({
							...formErrors,
							usernameFieldError: true
						});
					}
					if (error.response?.data.error === "Email already taken") {
						setFormErrors({
							...formErrors,
							emailFieldError: true
						});
					}
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
			email,
			password
		}: {
			email: string;
			password: string;
		}) => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-in`,
					{ email, password },
					{
						withCredentials: true
					}
				);

				return response;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true,
						type: "error"
					});
					if (error.response?.data.error === "Email is required") {
						setFormErrors({
							...formErrors,
							emailFieldError: true
						});
					}
					if (error.response?.data.error === "Invalid email or password") {
						setFormErrors({
							...formErrors,
							usernameFieldError: true,
							passwordFieldError: true
						});
					}
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

	function validator(password: string, confirmPassword?: string) {
		if (!password) {
			setPasswordLengthValid(false);
			setPassContainsNumsAndSymbols(false);
		}

		if (password.length > 6) {
			setPasswordLengthValid(true);
		}

		if (
			/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password) &&
			/\d/.test(password)
		) {
			setPassContainsNumsAndSymbols(true);
		}

		if (password === confirmPassword) {
			setPasswordsMatch(true);
		} else {
			setPasswordsMatch(false);
		}
	}

	function clearErrors() {
		setTimeout(() => {
			setFormErrors({
				usernameFieldError: false,
				emailFieldError: false,
				passwordFieldError: false,
				confirmPasswordFieldError: false
			});
		}, 1100);
	}

	function signUp(
		event: React.FormEvent,
		username: string,
		email: string,
		password: string,
		confirmPassword: string
	) {
		event.preventDefault();

		// Check for empty fields
		const fieldErrors = {
			usernameFieldError: !username,
			emailFieldError: !email,
			passwordFieldError: !password,
			confirmPasswordFieldError: !confirmPassword
		};

		const hasEmptyFields = Object.values(fieldErrors).some(Boolean);
		if (hasEmptyFields) {
			setFormErrors(fieldErrors);
			toast("Please fill in all fields", {
				autoClose: 700,
				hideProgressBar: true,
				type: "error"
			});
			clearErrors();
			return;
		}

		// Password match check
		if (password !== confirmPassword) {
			setFormErrors({
				usernameFieldError: false,
				emailFieldError: false,
				passwordFieldError: true,
				confirmPasswordFieldError: true
			});
			toast("Passwords do not match", {
				autoClose: 700,
				hideProgressBar: true,
				type: "error"
			});
			clearErrors();
			return;
		}

		// Password length check
		if (password.length < 6) {
			setFormErrors({
				usernameFieldError: false,
				emailFieldError: false,
				passwordFieldError: true,
				confirmPasswordFieldError: false
			});
			toast("Password must be at least 6 characters long", {
				autoClose: 700,
				hideProgressBar: true,
				type: "error"
			});
			clearErrors();
			return;
		}

		// Password number check
		if (!/\d/.test(password)) {
			setFormErrors({
				usernameFieldError: false,
				emailFieldError: false,
				passwordFieldError: true,
				confirmPasswordFieldError: false
			});
			toast("Password must contain at least one number", {
				autoClose: 700,
				hideProgressBar: true,
				type: "error"
			});
			clearErrors();
			return;
		}

		// Password symbol check
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
			setFormErrors({
				usernameFieldError: false,
				emailFieldError: false,
				passwordFieldError: true,
				confirmPasswordFieldError: false
			});
			toast("Password must contain at least one symbol", {
				autoClose: 700,
				hideProgressBar: true,
				type: "error"
			});
			clearErrors();
			return;
		}

		// All validations passed
		signUpMutate({ username, email, password, confirmPassword });
	}

	function signIn(event: React.FormEvent, email: string, password: string) {
		event.preventDefault();

		if (!email || !password) {
			setFormErrors({
				emailFieldError: !email,
				passwordFieldError: !password
			});
			toast("Please fill in all fields", {
				autoClose: 700,
				hideProgressBar: true,
				type: "error"
			});
			clearErrors();
		} else {
			signInMutate({ email, password });
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
		signOutIsPending,
		validator,
		passContainsNumsAndSymbols,
		passwordLengthValid,
		formErrors,
		passwordsMatch
	};
}
