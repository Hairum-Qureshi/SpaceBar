import { Request, Response } from "express";
import { IConversation, IUser } from "../interfaces";
import User from "../models/User";
import path from "path";
import fs from "fs";
import imagekit from "../configs/imagekit-config";
import { uploadImageToImageKit } from "../utils/file-related/uploadImageToImageKit";
import { getFileUploadData } from "../utils/file-related/getFileUploadData";

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const user: IUser = (await User.findById({
			_id: req.user._id
		}).select("-password -__v")) as IUser;

		res.status(200).send(user);
		return;
	} catch (error) {
		console.error(
			"Error in user.ts file, getCurrentUser function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const uploadProfilePicture = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const currUID: string = req.user._id;

		const { FOLDER_PATH, fileName, fileBuffer, pfpImageID } =
			await getFileUploadData(req, currUID);

		imagekit.getFileMetadata(pfpImageID, (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (result) {
					imagekit.deleteFile(pfpImageID, error => {
						if (error) console.log(error);
					});
				}
			}
			uploadImageToImageKit(
				fileBuffer,
				fileName,
				currUID,
				res,
				FOLDER_PATH,
				"pfp"
			);
		});
	} catch (error) {
		console.error(
			"Error in user.ts file, uploadProfilePicture function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { getCurrentUser, uploadProfilePicture };
