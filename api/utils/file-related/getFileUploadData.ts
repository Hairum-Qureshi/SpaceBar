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
	const ext: string = req.file?.mimetype.split("/").pop()!;
	const FOLDER_PATH = path.join(__dirname, "../../uploads");
	const fileName = `${
		imageFor === "pfp" ? `${currUID}.${ext}` : `gc-${currUID}.${ext}`
	}`;
	const fileBuffer: Buffer = fs.readFileSync(`${FOLDER_PATH}/${fileName}`);

	let imageID = "";
	if (imageFor === "pfp") {
		const user: IUser = (await User.findById(currUID)) as IUser;
		imageID = user?.pfpImageID;
	} else {
		const conversation: IConversation = (await Conversation.findById(
			conversationID
		)) as IConversation;
		imageID = conversation?.groupChatPhotoImageID;
	}

	return { FOLDER_PATH, fileName, fileBuffer, imageID };
}
