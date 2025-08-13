import { Request, Response } from "express";
import { IUser } from "../interfaces";
import User from "../models/User";
import path from "path";
import fs from "fs";
import imagekit from "../configs/imagekit-config";
import axios from "axios";

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

function uploadImageToImageKit(
	fileBuffer: Buffer,
	fileName: string,
	currUID: string,
	res: Response,
	FOLDER_PATH: string
) {
	imagekit
		.upload({
			file: fileBuffer,
			fileName: `pfp-${fileName}`
		})
		.then(async response => {
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

			fs.unlink(path.join(FOLDER_PATH, fileName), err => {
				if (err) throw err;
			});

			res.status(200).json(updatedUser);
		})
		.catch(error => {
			console.error("Image upload error:", error);

			fs.unlink(path.join(FOLDER_PATH, fileName), err => {
				if (err) throw err;
			});
		});
}

const uploadProfilePicture = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const ext: string = req.file?.mimetype.split("/").pop()!;
		const FOLDER_PATH = path.join(__dirname, "..", "./uploads");
		const currUID: string = req.user._id;
		const fileName = `${currUID}.${ext}`;
		const fileBuffer: Buffer = fs.readFileSync(`${FOLDER_PATH}/${fileName}`);

		const { pfpImageID }: IUser = (await User.findById(currUID)) as IUser;

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
			uploadImageToImageKit(fileBuffer, fileName, currUID, res, FOLDER_PATH);
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
