import { Request, Response } from "express";
import { IUser } from "../interfaces";
import User from "../models/User";
import imagekit from "../configs/imagekit-config";
import { uploadImageToImageKit } from "../utils/file-related/uploadImageToImageKit";
import { getFileUploadData } from "../utils/file-related/getFileUploadData";
import { v4 as uuidv4 } from "uuid";
import admin from "../configs/firebase/firebase-config";

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

		const {
			FOLDER_PATH,
			fileName,
			fileBuffer,
			imageID: pfpImageID
		} = await getFileUploadData(req, currUID, "pfp");

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

async function handleDatabaseUserRemoval(uid: string): Promise<IUser> {
	const user: IUser = (await User.findByIdAndUpdate(
		uid,
		{
			$set: {
				username: `DELETED_USER_${uuidv4().substring(0, 8)}`,
				email: "DELETED_USER",
				password: "DELETED_USER",
				profilePicture:
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx-NP_Wn_xnnzlQYXWRJorxpkeyQtkKf957g&s"
			}
		},
		{ new: true }
	)) as IUser;

	// TODO - may need to check if it was actually deleted from Image Kit

	if (user.pfpImageID) {
		imagekit.deleteFile(user.pfpImageID, error => {
			if (error) console.log(error);
		});

		const updatedUser: IUser = (await User.findByIdAndUpdate(uid, {
			$set: {
				pfpImageID: ""
			}
		})) as IUser;

		return updatedUser;
	}

	return user;
}

const deleteUserAccount = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// TODO - update the 'delete convo' logic where if the user is deleted and the other user wants to delete the chat, it'll delete the convo entirely including all the messages

		// TODO - for signing in, make sure you add a check to see if the username doesn't include 'DELETED_USER_' in it to prevent users from signing in on deleted accounts

		// TODO - maybe add logic in the sign up function to prevent users from signing up with 'DELETED_USER_' in their username

		// TODO - double check if this logic works as expected

		const currUID: string = req.user._id;
		const userEmail: string = req.user.email;
		let updatedUser: IUser;

		if (userEmail.endsWith("@gmail.com")) {
			// Deletes registered email from Firebase which *should* prevent you from re-signing into your deleted account if you try to sign in again with Google
			admin
				.auth()
				.getUserByEmail(userEmail)
				.then(userRecord => {
					const uid = userRecord.uid;
					admin
						.auth()
						.deleteUser(uid)
						.then(async () => {
							updatedUser = await handleDatabaseUserRemoval(uid);
							return updatedUser;
						})
						.catch(error => {
							console.error("Error deleting user:", error);
						});
				})
				.catch(error => {
					console.error("Error fetching user by email:", error);
				});

			return;
		}

		updatedUser = await handleDatabaseUserRemoval(currUID);

		res.status(200).json({ updatedUser });
	} catch (error) {
		console.error(
			"Error in user.ts file, deleteUserAccount function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { getCurrentUser, uploadProfilePicture, deleteUserAccount };
