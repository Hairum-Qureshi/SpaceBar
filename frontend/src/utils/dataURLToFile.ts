import axios from "axios";

export async function dataURLToFile(
	dataURLToFile: string,
	fileFor?: string
): Promise<File> {
	const response = await axios.get(dataURLToFile, { responseType: "blob" });
	const blob = response.data;
	const originalFile = await fetch(dataURLToFile).then(res => res.blob());

	return new File(
		[blob],
		`${
			fileFor && fileFor === "groupChat"
				? `gc-${Date.now()}`
				: `message-${Date.now()}`
		}`,
		{
			type: originalFile.type
		}
	);
}
