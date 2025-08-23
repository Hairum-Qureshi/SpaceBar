import { useCurrentUser } from "../hooks/useCurrentUser";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import moment from "moment";
import { Bounce, toast, ToastContainer } from "react-toastify";
import useAuth from "../hooks/useAuth";
import ImageUploading, { type ImageListType } from "react-images-uploading";
import { useState } from "react";
import type { ImageFile } from "../interfaces";
import useProfile from "../hooks/useProfile";

export default function Settings() {
	const { data: userData } = useCurrentUser();
	const [profilePicture] = useState<ImageFile[]>([]);
	const { uploadProfilePicture } = useProfile();

	const onChange = (imageList: ImageListType) => {
		uploadProfilePicture(imageList as ImageFile[]);
	};

	// TODO - style toast notification
	// TODO - add toggle option to disable Notifications

	const notify = () => toast("User ID copied!");
	const { signOut } = useAuth();

	return (
		<div className="w-full bg-zinc-950 p-3 min-h-screen flex justify-center items-start">
			<ToastContainer
				position="bottom-right"
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
			<div className="w-full max-w-4xl relative min-h-screen rounded-lg overflow-hidden shadow-xl">
				<div className="relative z-10 backdrop-blur-sm bg-black/60 text-white p-6 space-y-6">
					<div className="hover:cursor-pointer">
						<Link to="/" className="flex items-center">
							<span>
								<FaArrowLeft />
							</span>
							<span className="ml-2">Go Back</span>
						</Link>
					</div>
					<div className="flex items-center gap-6">
						<ImageUploading
							multiple
							value={profilePicture}
							onChange={onChange}
							maxNumber={1}
						>
							{({ onImageUpload }) => (
								<img
									src={userData?.profilePicture}
									alt="User profile"
									referrerPolicy="no-referrer"
									className="w-28 h-28 rounded-full object-cover border-2 border-purple-800 hover:cursor-pointer hover:opacity-70"
									onClick={() => {
										onImageUpload();
									}}
								/>
							)}
						</ImageUploading>
						<div>
							<h1 className="text-3xl font-bold text-white">Settings</h1>
							<p className="text-lg font-semibold text-gray-300">
								@{userData?.username}
							</p>
							<p className="text-gray-400 text-sm">{userData?.email}</p>
						</div>
					</div>
					<div>
						<h2 className="text-2xl font-semibold text-white mb-2">Details</h2>
						<p className="text-gray-300">
							<div className="flex items-center">
								<span>
									Joined:{" "}
									<span className="text-orange-500">
										{moment(userData?.createdAt).fromNow()}
									</span>
								</span>
							</div>
						</p>
						<div className="text-gray-300">
							<div className="flex items-center">
								<span>Shareable User ID:</span>
								<span className="font-mono text-pink-600 ml-2">
									{userData?._id}
								</span>
								<span
									className="text-white ml-2 hover:cursor-pointer"
									onClick={() => {
										navigator.clipboard.writeText(userData?._id);
										notify();
									}}
								>
									<MdContentCopy />
								</span>
							</div>
							<span className="flex text-xs text-purple-500">
								<span className="flex items-center">
									<IoMdInformationCircleOutline />
								</span>
								<p className="ml-1">
									Share your UID with friends to start a conversation with them
								</p>
							</span>
						</div>
					</div>
					<div>
						<button
							className="bg-purple-700 hover:bg-purple-800 text-white font-semibold p-2 rounded-md w-36 mr-2 hover:cursor-pointer"
							onClick={() => signOut()}
						>
							Sign Out
						</button>
						<button className="bg-red-600 hover:bg-red-700 text-white font-semibold p-2 rounded-md w-36 hover:cursor-pointer">
							Delete Account
						</button>
					</div>
					<img
						src="https://img.freepik.com/free-photo/abstract-luxury-soft-red-background-christmas-valentines-layout-designstudioroom-web-template-business-report-with-smooth-circle-gradient-color_1258-102209.jpg?semt=ais_hybrid&w=740&q=80"
						alt="Background"
						className="w-full h-full object-cover absolute inset-0 -z-30 "
					/>
				</div>
			</div>
		</div>
	);
}
