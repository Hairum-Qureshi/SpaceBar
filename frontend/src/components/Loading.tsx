import { tailspin } from "ldrs";
tailspin.register();

export default function Loading() {
	return (
		<div className="bg-zinc-950 h-screen w-full relative">
			<img
				src="https://wallpapers.com/images/hd/red-light-aesthetic-galaxy-h32ayuraxnrntoqu.jpg"
				alt="Background Image"
				className="w-full h-screen object-cover opacity-70"
			/>
			<div
				className="absolute inset-0 text-sky-300 font-semibold flex flex-col items-center justify-center text-4xl"
				style={{ textShadow: "2px 2px 8px #001f3f" }}
			>
				<l-tailspin size="60" stroke="6" speed="0.9" color="white" />
			</div>
		</div>
	);
}
