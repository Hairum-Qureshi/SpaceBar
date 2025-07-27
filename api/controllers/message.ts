import { Request, Response } from "express";
import Message from "../models/inbox/Message";
import Conversation from "../models/inbox/Conversation";
import { redis } from "../redis-config";
import { io } from "../socket";

const sendMessage = async (req: Request, res: Response): Promise<void> => {
	try {
		const { message, userID, conversationID } = req.body;
		const currUID = req.user._id;

		if (!message) {
			res.status(400).json({ error: "Message is required" });
			return;
		}

		const savedMessage = new Message({
			message,
			sender: currUID,
			conversationID
		});

		await savedMessage.save();

		const updatedConversation = await Conversation.findByIdAndUpdate(
			conversationID,
			{
				$push: { messages: savedMessage._id }
			},
			{
				new: true
			}
		);

		const socketID = await redis.get(`active:${userID}`);
		if (socketID) {
			io.to(socketID).emit("newMessage", conversationID);
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
