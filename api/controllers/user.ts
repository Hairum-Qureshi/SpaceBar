import { Request, Response } from "express";
import { IUser } from "../interfaces";
import User from "../models/User";
import path from "path";
import fs from "fs";
import imagekit from "../configs/imagekit-config";

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
		const ext: string = req.file?.mimetype.split("/").pop()!;
		const FOLDER_PATH = path.join(__dirname, "..", "./uploads");
		const currUID: string = req.user._id;
		const fileName = `${currUID}.${ext}`;
		const fileBuffer = fs.readFileSync(`${FOLDER_PATH}/${fileName}`);
		let profilePictureExists = false;

		imagekit.listFiles(
			{
				searchQuery: `name="pfp-${fileName}"`
			},
			(error, result) => {
				if (error) console.log(error);
				else {
					profilePictureExists = (result && result.length > 0) || false;
				}
			}
		);

		if (profilePictureExists) {
			imagekit.deleteFile(`pfp-${fileName}`, (error, result) => {
				if (error) console.log(error);
				else console.log(result);
			});
		}

		imagekit
			.upload({
				file: fileBuffer,
				fileName: `pfp-${fileName}`,
				useUniqueFileName: false
			})
			.then(async response => {
				const updatedUser: IUser = (await User.findByIdAndUpdate(
					currUID,
					{
						profilePicture: response.url
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
