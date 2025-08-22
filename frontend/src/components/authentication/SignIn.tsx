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

	return (
		<div className="bg-black h-screen lg:w-full lg:flex text-white">
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
			<div className="lg:rounded-2xl lg:w-2/3 md:w-full h-screen flex items-center justify-center">
				<img src={spaceImage} alt="Space Image" />
			</div>
			<div className="bg-zinc-950 lg:rounded-2xl lg:w-2/3 md:w-full flex justify-center items-center lg:border-2 lg:border-zinc-600">
				<div className="w-3/4 -mt-5">
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
								<button
									className="p-2 border flex items-center justify-center border-sky-600 rounded-md w-1/2 ml-1 hover:cursor-pointer"
									onClick={e => {
										e.preventDefault();
										alert("Coming soon!");
									}}
								>
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
							<div className="flex flex-col">
								<label className="text-slate-500 mb-1">
									Email<span className="text-red-600 ml-1">*</span>
								</label>
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
							<div className="mt-5">
								<label className="text-slate-500">
									Password<span className="text-red-600 ml-1">*</span>
								</label>
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
							className="p-2 mb-10 lg:mb-0 w-full text-lg rounded-md mt-8 bg-blue-950 hover:cursor-pointer"
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
