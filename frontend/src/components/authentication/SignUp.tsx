import { FaApple, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import spaceImage from "../../assets/auth-forms-image.jpg";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const { signUp, signUpIsPending } = useAuth();

	// TODO - add toast notif

	return (
		<div className="bg-black h-screen w-full flex text-white">
			<div className="rounded-2xl w-1/2 h-screen flex items-center justify-center">
				<img src={spaceImage} alt="Space Image" />
			</div>
			<div className="bg-zinc-950 rounded-2xl w-1/2 flex justify-center items-center border-2 border-zinc-600">
				<div className="w-3/4">
					<div className="mb-8 text-center">
						<h1 className="text-zinc-400 text-4xl mb-3">
							Join <span className="text-sky-500">Space Bar</span>
						</h1>
						<h3 className="text-zinc-300 text-xl">
							Start texting now with friends
						</h3>
						<p className="mt-3 -mb-3">
							Already have an account?&nbsp;
							<Link to="/sign-in" className="text-sky-500">
								Sign in
							</Link>
						</p>
					</div>
					<form
						onSubmit={e =>
							signUp(e, username, email, password, confirmPassword)
						}
					>
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
								<div className="flex flex-col w-1/2">
									<label className="mr-1 text-slate-500 mb-1">Username</label>
									<input
										type="text"
										placeholder="Username"
										className="w-full outline-none p-2 text-base bg-slate-900 rounded-md border border-sky-600 mr-2"
										value={username}
										onChange={e => setUsername(e.target.value)}
									/>
								</div>
								<div className="flex flex-col w-1/2">
									<label className="ml-2 text-slate-500 mb-1">Email</label>
									<input
										type="email"
										placeholder="Email"
										className="w-full outline-none p-2 text-base bg-slate-900 rounded-md border border-sky-600 ml-2"
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
									className="outline-none p-2 text-base bg-slate-900 rounded-md w-full my-2 border border-sky-600"
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
								<div className="text-sm text-slate-600 mb-3">
									<p>Password must contain letters, numbers, and symbols</p>
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-full border border-slate-600 my-2"></div>
										<p className="ml-2">Contains numbers & symbols</p>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-full border border-slate-600 my-2"></div>
										<p className="ml-2">6+ characters long</p>
									</div>
								</div>
							</div>
							<div>
								<label className="text-slate-500">Confirm Password</label>
								<input
									type="password"
									placeholder="Confirm Password"
									className="outline-none p-2 text-base bg-slate-900 rounded-md w-full my-2 border border-sky-600"
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
								/>
							</div>
							<p className="text-sm my-2 text-slate-500">
								By signing up, you agree to Space Bar's&nbsp;
								<Link to="#">
									<span className="text-sky-500 font-semibold">
										privacy policy
									</span>
								</Link>
							</p>
						</div>
						<button
							className="p-2 w-full text-lg rounded-md mt-8 bg-blue-950 hover:cursor-pointer"
							disabled={signUpIsPending}
							type="submit"
						>
							{signUpIsPending ? "Loading..." : "Sign Up"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
