import axios from "axios";

export async function dataURLToFile(
	dataURLToFile: string,
	currUID?: string,
	fileFor?: string
): Promise<File> {
	const response = await axios.get(dataURLToFile, { responseType: "blob" });
	const blob = response.data;
	const originalFile = await fetch(dataURLToFile).then(res => res.blob());

	return new File(
		[blob],
		`${
			fileFor && fileFor === "groupChat" && currUID
				? `gc-${currUID}`
				: `message-${Date.now()}`
		}`,
		{
			type: originalFile.type
		}
	);
}
