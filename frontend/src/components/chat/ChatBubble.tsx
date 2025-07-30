interface ChatBubbleProps {
	you: boolean;
	message: string;
	images: string[];
}

// TODO - add posted date

export default function ChatBubble({ you, message, images }: ChatBubbleProps) {
	const imageCount = images.length;
	return [
		imageCount === 0 ? (
			<div
				className={`relative bg-gradient-to-tr from-indigo-800 to-violet-900 p-3 text-base text-white w-fit my-3 mx-3 rounded-lg border border-purple-700 shadow-md max-w-2/3 ${
					you && "ml-auto"
				}`}
			>
				{message}
			</div>
		) : (
			<div
				className={`relative bg-gradient-to-tr from-indigo-800 to-violet-900 p-4 text-white w-full max-w-lg my-4 mx-4 rounded-lg border border-purple-700 shadow-md ${
					you ? "ml-auto" : ""
				}`}
			>
				{/* 3-Image Layout */}
				{imageCount === 3 && (
					<div className="grid grid-cols-3 grid-rows-2 gap-4">
						{/* Top-left square */}
						<div className="aspect-square flex items-center justify-center overflow-hidden rounded-md">
							<img
								src={images[0]}
								alt="Image 1"
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Right-side big image */}
						<div className="col-span-2 row-span-2 flex items-center justify-center overflow-hidden rounded-md">
							<img
								src={images[1]}
								alt="Image 2"
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Bottom-left square */}
						<div className="aspect-square flex items-center justify-center overflow-hidden rounded-md">
							<img
								src={images[2]}
								alt="Image 3"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				)}

				{/* 4-Image Layout */}
				{imageCount === 4 && (
					<div className="grid grid-cols-2 grid-rows-2 gap-2 w-96 h-96">
						{images.slice(0, 4).map((src, index) => (
							<div key={index} className="w-full h-full">
								<img
									src={src}
									alt={`Image ${index + 1}`}
									className="w-full h-full object-cover rounded-md"
								/>
							</div>
						))}
					</div>
				)}

				{/* Fallback for 1 or 2 images: render them in a simple row */}
				{(imageCount === 1 || imageCount === 2) && (
					<div
						className={`grid gap-4 ${
							imageCount === 2 ? "grid-cols-2" : "grid-cols-1"
						}`}
					>
						{images.map((src, index) => (
							<div key={index} className="rounded-md overflow-hidden">
								<img
									src={src}
									alt={`Image ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				)}

				<p className="text-white mt-3 text-base">{message}</p>
			</div>
		)
	];
}
