import { Request } from "express";
import { FileUploadData, IConversation, IUser } from "../../interfaces";
import path from "path";
import fs from "fs";
import User from "../../models/User";
import Conversation from "../../models/inbox/Conversation";

export async function getFileUploadData(
	req: Request,
	currUID: string,
	imageFor: string,
	conversationID?: string
): Promise<FileUploadData> {
	try {
		const ext: string = req.file?.mimetype.split("/").pop()!;
		const FOLDER_PATH = path.join(__dirname, "../../uploads");
		const fileName = `${
			imageFor === "pfp" ? `${currUID}.${ext}` : `gc-${currUID}.${ext}`
		}`;
		let fileBuffer: Buffer;

		let imageID = "";
		if (imageFor === "pfp") {
			const user: IUser = (await User.findById(currUID)) as IUser;
			imageID = user?.pfpImageID;
			fileBuffer = fs.readFileSync(`${FOLDER_PATH}/${fileName}`);
			return { FOLDER_PATH, fileName, fileBuffer, imageID };
		} else {
			const files = fs.readdirSync(FOLDER_PATH);

			const match = files.find(rawFile => {
				return rawFile.includes(`gc-${currUID}`);
			});

			if (!match) {
				throw new Error("No matching group chat image found");
			}

			// use the actual matched filename
			fileBuffer = fs.readFileSync(path.join(FOLDER_PATH, match));

			const conversation: IConversation = (await Conversation.findById(
				conversationID
			)) as IConversation;

			imageID = conversation?.groupChatPhotoImageID;

			return { FOLDER_PATH, fileName: match, fileBuffer, imageID };
		}
	} catch (err) {
		console.error(
			"<getFileUploadData> There was a problem:".red,
			(err as Error).toString().red
		);
		throw err;
	}
}
