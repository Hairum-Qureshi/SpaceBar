import { FaApple, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import spaceImage from "../../assets/auth-forms-image.jpg";
import { Bounce, ToastContainer } from "react-toastify";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { signIn, signInIsPending, formErrors } = useAuth();

	// TODO - add toast notif

	return (
		<div className="bg-black h-screen w-full flex text-white">
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				theme="dark"
				pauseOnHover={false}
				transition={Bounce}
			/>
			<div className="rounded-2xl w-1/2 h-screen flex items-center justify-center">
				<img src={spaceImage} alt="Space Image" />
			</div>
			<div className="bg-zinc-950 rounded-2xl w-1/2 flex justify-center items-center border-2 border-zinc-600">
				<div className="w-3/4">
					<div className="mb-8 text-center">
						<h1 className="text-zinc-400 text-4xl mb-3">
							Welcome back to <span className="text-sky-500">Space Bar</span>
						</h1>
						<p className="mt-3 -mb-3">
							Don't have an account?&nbsp;
							<Link to="/sign-up" className="text-sky-500">
								Sign up
							</Link>
						</p>
					</div>
					<form onSubmit={e => signIn(e, email, password)}>
						<div>
							<div className="flex items-center">
								<button className="p-2 border flex items-center justify-center border-sky-600 rounded-md w-1/2 mr-1 hover:cursor-pointer">
									<span>
										<FaGoogle />
									</span>
									&nbsp; Google
								</button>
								<button className="p-2 border flex items-center justify-center border-sky-600 rounded-md w-1/2 ml-1 hover:cursor-pointer">
									<span className="text-xl">
										<FaApple />
									</span>
									&nbsp; Apple
								</button>
							</div>
							<div className="flex items-center gap-4 my-3">
								<hr className="flex-grow border-t border-gray-300" />
								<span className="text-gray-500 text-sm">or</span>
								<hr className="flex-grow border-t border-gray-300" />
							</div>
							<div className="flex items-center">
								<div className="flex flex-col w-full">
									<label className="text-slate-500 mb-1">Email</label>
									<input
										type="email"
										placeholder="Email"
										className={`outline-none p-2 text-base bg-slate-900 rounded-md w-full my-2 border ${
											!formErrors.emailFieldError
												? "border-sky-600"
												: "border-red-600"
										}`}
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
								</div>
							</div>
							<div className="mt-5">
								<label className="ml-1 text-slate-500">Password</label>
								<input
									type="password"
									placeholder="Password"
									className={`outline-none p-2 text-base bg-slate-900 rounded-md w-full my-2 border ${
										!formErrors.passwordFieldError
											? "border-sky-600"
											: "border-red-600"
									}`}
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</div>
						</div>
						<button
							className="p-2 w-full text-lg rounded-md mt-8 bg-blue-950 hover:cursor-pointer"
							onSubmit={e => signIn(e, email, password)}
							disabled={signInIsPending}
							type="submit"
						>
							{signInIsPending ? "Loading..." : "Sign In"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
