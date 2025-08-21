import { Response } from "express";
import imagekit from "../../configs/imagekit-config";
import { IConversation, IUser } from "../../interfaces";
import User from "../../models/User";
import Conversation from "../../models/inbox/Conversation";
import fs from "fs";
import path from "path";

export function uploadImageToImageKit(
	fileBuffer: Buffer,
	fileName: string,
	currUID: string,
	res: Response,
	FOLDER_PATH: string,
	fileFor: string,
	conversationID?: string
) {
	imagekit
		.upload({
			file: fileBuffer,
			fileName: `${fileFor === "pfp" ? `pfp-${fileName}` : `${fileName}`}`
		})
		.then(async response => {
			if (fileFor === "pfp") {
				const updatedUser: IUser = (await User.findByIdAndUpdate(
					currUID,
					{
						profilePicture: response.url,
						pfpImageID: response.fileId
					},
					{
						new: true
					}
				)) as IUser;

				res.status(200).json(updatedUser);
			}

			if (fileFor === "groupChat" && conversationID) {
				await Conversation.findByIdAndUpdate(
					conversationID,
					{
						groupPhoto: response.url,
						groupChatPhotoImageID: response.fileId
					},
					{
						new: true
					}
				);
			}

			fs.unlink(path.join(FOLDER_PATH, fileName), err => {
				if (err) throw err;
			});
		})
		.catch(error => {
			console.error("Image upload error:", error);

			fs.unlink(path.join(FOLDER_PATH, fileName), err => {
				if (err) throw err;
			});
		});
}
