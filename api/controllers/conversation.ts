import { Request, Response } from "express";
import Conversation from "../models/inbox/Conversation";
import { IConversation, IUser, MinimalUserData } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import "../models/inbox/Message";
import Message from "../models/inbox/Message";
import imagekit from "../configs/imagekit-config";
import { FileObject, FolderObject } from "imagekit/dist/libs/interfaces";
import { getFileUploadData } from "../utils/file-related/getFileUploadData";
import { uploadImageToImageKit } from "../utils/file-related/uploadImageToImageKit";

const createConversation = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// TODO - will need to make it handle group chats
		const { username } = req.body;
		const currUID: string = req.user._id;

		if (username === req.user.username) {
			res
				.status(400)
				.json({ error: "You can't create a conversation to yourself" });
			return;
		}

		if (!username) {
			res.status(400).json({ error: "Friend username is required" });
			return;
		}

		// first check if the friendUID is valid
		const friendUser: IUser = (await User.findOne({ username })) as IUser;
		if (!friendUser) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		// next check if the users have a conversation with each other
		const existingConversation: IConversation | undefined =
			(await Conversation.findOne({
				users: { $all: [friendUser._id, currUID] }
			})) as IConversation | undefined;

		const userHasConversation = await User.findOne({
			_id: currUID,
			conversations: existingConversation?._id
		});

		// check if the conversation exists but the user removed the conversation ID from their list of conversations
		if (existingConversation && !userHasConversation) {
			// add the conversation ID back to the user's list of conversations
			await User.findByIdAndUpdate(currUID, {
				$addToSet: {
					conversations: existingConversation._id
				}
			});

			res.status(200).send(existingConversation);
			return;
		}

		if (!existingConversation) {
			// create the convo
			const newConversation = new Conversation({
				_id: uuidv4().replace(/-/g, ""),
				users: [currUID, friendUser._id]
			});

			await newConversation.save();

			await User.findByIdAndUpdate(currUID, {
				$addToSet: {
					conversations: newConversation._id
				}
			});

			await User.findByIdAndUpdate(friendUser._id, {
				$addToSet: {
					conversations: newConversation._id
				}
			});

			res.status(200).send(newConversation);
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

		const sortedConversations = conversations.sort((a, b) => {
			return b.createdAt.getTime() - a.createdAt.getTime();
		});

		res.status(200).send(sortedConversations);
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

const getConversationData = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const conversation: IConversation | null = await Conversation.findById(
			conversationID
		).populate({
			path: "users",
			select: "_id username profilePicture"
		});

		if (!conversation) {
			res.status(404).json({ error: "Conversation not found" });
			return;
		}

		const conversationImages = await Message.find({
			conversationID,
			attachments: {
				$exists: true,
				$ne: []
			}
		}).select({ attachments: 1, _id: 0 });

		const conversationMembers: MinimalUserData[] =
			conversation.users as unknown as MinimalUserData[];

		res.status(200).json({
			conversationImages,
			conversationMembers
		});
	} catch (error) {
		console.error(
			"Error in conversation.ts file, getConversationData function controller"
				.red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteConversation = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const currUID: string = req.user._id;

		// first check if the conversation exists
		const conversation = await Conversation.findById(conversationID);

		if (!conversation) {
			res.status(404).json({ error: "Conversation not found" });
			return;
		}

		// second check if the user is part of the conversation
		if (!conversation.users.includes(currUID)) {
			res.status(403).json({ error: "You are not part of this conversation" });
			return;
		}

		// if they are, remove the conversation from their list of conversations (don't remove them from the list of users in the conversation)
		await User.findByIdAndUpdate(currUID, {
			$pull: {
				conversations: conversationID
			}
		});

		// check if all the users in the conversation have removed the conversation, if so, delete the conversation from the database
		const usersWithConversation = await User.find({
			conversations: conversationID
		});
		if (usersWithConversation.length === 0) {
			await Conversation.findByIdAndDelete(conversationID);

			// Also delete all messages associated with the conversation
			await Message.deleteMany({ conversationID });

			// Handles deleting all images uploaded from the conversation
			await imagekit
				.listFiles({
					tags: [`convo-${conversationID}`]
				})
				.then(result => {
					result.forEach(async (file: FileObject | FolderObject) => {
						await imagekit.deleteFile((file as FileObject).fileId);
					});
				});
		}

		res.status(200).json({ message: "Conversation deleted successfully" });
	} catch (error) {
		console.error(
			"Error in conversation.ts file, getConversationData function controller"
				.red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const createGroupChat = async (req: Request, res: Response): Promise<void> => {
	try {
		const { groupChatName, members } = req.body;
		const currUID: string = req.user._id;

		// TODO - think about creating a separate helper function *or* using the existing helper function when it comes to deleting all the images from Cloudinary (including the group chat photo) when the group chat gets deleted from the database

		if (typeof members !== "string") {
			res.status(400).json({ error: "Members must be a string" });
			return;
		}

		if (!groupChatName?.trim() || !members?.trim()) {
			res.status(400).json({
				error: "Please provide a group chat name and at least two members"
			});
			return;
		}

		if (!members.includes(",")) {
			res.status(400).json({
				error: "Please make sure you're using a comma separated list"
			});
			return;
		}

		if (members.includes(req.user.username)) {
			res.status(400).json({
				error: "You cannot add yourself to a group chat"
			});
			return;
		}

		const memberList = members
			.split(",")
			.map(m => m.trim())
			.filter(Boolean); // remove empty strings

		if (memberList.length < 2) {
			res.status(400).json({
				error: "Please provide at least two members to create a group chat"
			});
			return;
		}

		if (memberList.length > 10) {
			res.status(400).json({
				error: "Group chats can only have up to 10 members"
			});
			return;
		}

		if (members.split(", ").length < 2 || members.split(",").length < 2) {
			res.status(400).json({
				error: "Group chats must have at least 2 other people"
			});
			return;
		}

		// create the group chat
		// first verify if all the users within members exist
		const foundUsers: IUser[] = (await User.find({
			username: { $in: memberList }
		}).lean()) as IUser[];

		let foundUsersMap: Map<string, IUser> = new Map();
		for (const user of foundUsers) {
			foundUsersMap.set(user.username, user);
		}

		if (foundUsersMap.size !== memberList.length) {
			// not all users were found. Find the users that weren't
			const missingUsers: string[] = [];
			for (const username of memberList) {
				if (!foundUsersMap.has(username)) missingUsers.push(`@${username}`);
			}

			res.status(400).json({
				message: `The following user(s) could not be found: ${missingUsers.join(
					", "
				)}`
			});

			return;
		}

		const uids: string[] = [currUID];
		for (const username of memberList) {
			const uid = foundUsersMap.get(username)?._id;
			if (uid) uids.push(uid);
		}

		const newConversation = new Conversation({
			_id: uuidv4().replace(/-/g, ""),
			users: uids,
			isGroupChat: true,
			groupName: groupChatName,
			admins: [currUID]
		});

		newConversation.save();

		await User.updateMany(
			{ _id: { $in: uids } },
			{ $addToSet: { conversations: newConversation._id } }
		);

		const { FOLDER_PATH, fileName, fileBuffer, imageID } =
			await getFileUploadData(req, currUID, "groupChat");

		imagekit.getFileMetadata(imageID, (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (result) {
					imagekit.deleteFile(imageID, error => {
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
				"groupChat",
				newConversation._id
			);

			res.status(200).send(newConversation);
		});
	} catch (error) {
		console.error(
			"Error in conversation.ts file, createGroupChat function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export {
	createConversation,
	getAllConversations,
	getConversationByID,
	getAllChatMessages,
	getConversationData,
	deleteConversation,
	createGroupChat
};
