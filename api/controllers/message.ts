import { Request, Response } from "express";
import Message from "../models/inbox/Message";
import Conversation from "../models/inbox/Conversation";
import { redis } from "../configs/redis-config";
import { io } from "../socket";
import imagekit from "../configs/imagekit-config";
import fs from "fs";
import path from "path";
import { Types } from "mongoose";

async function uploadImages(conversationID: string): Promise<string[]> {
	const FOLDER_PATH = path.join(__dirname, "..", "./uploads");
	const urls: string[] = [];

	const files = await fs.promises.readdir(FOLDER_PATH); // Use promise-based fs
	const uploadPromises = files
		.filter(file => file.includes(conversationID))
		.map(file => {
			const uploadedImagePath = path.resolve(FOLDER_PATH, file);
			const fileBuffer = fs.readFileSync(uploadedImagePath);

			return imagekit
				.upload({
					file: fileBuffer,
					fileName: file
				})
				.then(response => {
					urls.push(response.url);

					fs.unlink(path.join(FOLDER_PATH, file), err => {
						if (err) throw err;
					});
				})
				.catch(error => {
					console.error("Image upload error:", error);

					fs.unlink(path.join(FOLDER_PATH, file), err => {
						if (err) throw err;
					});
				});
		});

	await Promise.all(uploadPromises);

	return urls;
}

const sendMessage = async (req: Request, res: Response): Promise<void> => {
	try {
		const { message, userID, conversationID, imagesSent } = req.body;
		const currUID = req.user._id;

		if (imagesSent === "false" && !message) {
			// yes, false has to be a string here
			res.status(400).json({ error: "Message is required" });
			return;
		}

		let createdMessageID: Types.ObjectId;
		if (imagesSent === "true") {
			// yes, true has to be a string as well
			const uploadedImageURLs: string[] = await uploadImages(conversationID);
			const savedMessageWithImages = new Message({
				message,
				sender: currUID,
				conversationID,
				attachments: uploadedImageURLs
			});

			await savedMessageWithImages.save();

			createdMessageID = savedMessageWithImages._id;
		} else {
			const savedMessage = new Message({
				message,
				sender: currUID,
				conversationID
			});

			await savedMessage.save();
			createdMessageID = savedMessage._id;
		}

		const updatedConversation = await Conversation.findByIdAndUpdate(
			conversationID,
			{
				$push: { messages: createdMessageID._id }
			},
			{
				new: true
			}
		);

		const socketID = await redis.get(`active:${userID}`);

		// TODO - will need to handle group chat case
		const messagePayload = {
			messageID: createdMessageID,
			conversationID,
			username: req.user.username,
			profilePicture: req.user.profilePicture,
			message,
			containedImages: imagesSent === "true" // yes it has to be a string
		};
		if (socketID) {
			io.to(socketID).emit("newMessage", messagePayload);
		}

		res.status(200).json(updatedConversation);
	} catch (error) {
		console.error(
			"Error in message.ts file, sendMessage function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { sendMessage };
