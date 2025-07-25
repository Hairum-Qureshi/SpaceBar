import { Request, Response } from "express";
import Conversation from "../models/inbox/Conversation";
import { IConversation } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import "../models/inbox/Message";

const createConversation = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// TODO - will need to make it handle group chats
		const { friendUID } = req.body;
		const currUID: string = req.user._id;

		if (friendUID === currUID) {
			res.status(400).json({ message: "You can't send a message to yourself" });
			return;
		}

		if (!friendUID) {
			res.status(400).json({ message: "Friend UID is required" });
		}

		// first check if the users have a conversation with each other
		const existingConversation: IConversation | undefined =
			(await Conversation.findOne({
				users: { $all: [friendUID, currUID] }
			})) as IConversation | undefined;

		if (!existingConversation) {
			// create the convo
			const newConversation = new Conversation({
				_id: uuidv4().replace(/-/g, ""),
				users: [currUID, friendUID]
			});

			await newConversation.save();

			await User.findByIdAndUpdate(currUID, {
				$addToSet: {
					conversations: newConversation._id
				}
			});

			await User.findByIdAndUpdate(friendUID, {
				$addToSet: {
					conversations: newConversation._id
				}
			});

			res.status(200).send(newConversation);
		} else {
			// the users already have a convo together
		}
	} catch (error) {
		console.error(
			"Error in conversation.ts file, createConversation function controller"
				.red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllConversations = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const currUID: string = req.user._id;

		const userWithConversations = await User.findById(currUID)
			.select("conversations")
			.populate({
				path: "conversations",
				select: "-__v",
				populate: {
					path: "users",
					select: "-password -__v -conversations"
				}
			});

		const conversations =
			userWithConversations?.conversations as IConversation[];

		res.status(200).send(conversations);
	} catch (error) {
		console.error(
			"Error in conversation.ts file, getAllConversations function controller"
				.red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getConversationByID = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const currUID: string = req.user._id;

		const conversation: IConversation = (await Conversation.findById(
			conversationID
		).populate([
			{
				path: "users",
				select: "-password -__v -conversations"
			},
			{
				path: "messages",
				select: "-__v"
			}
		])) as IConversation;

		res.send(conversation);
	} catch (error) {
		console.error(
			"Error in conversation.ts file, getConversationByID function controller"
				.red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllChatMessages = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationID } = req.params;

		if (!conversationID) {
			res.status(200).send([]);
			return;
		}

		const conversation = await Conversation.findById(conversationID)
			.select("-__v -createdAt -updatedAt")
			.populate({
				path: "messages",
				select: "-__v -updatedAt",
				populate: {
					path: "sender",
					select: "_id username profilePicture"
				}
			})
			.lean();

		res.status(200).json(conversation?.messages || []);
	} catch (error) {
		console.error(
			"Error in message.ts file, getAllChatMessages function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { createConversation, getAllConversations, getConversationByID, getAllChatMessages };
