import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import {
	createConversation,
	createGroupChat,
	deleteConversation,
	getAllChatMessages,
	getAllConversations,
	getConversationByID,
	getConversationData
} from "../controllers/conversation";

import multer from "multer";
import storage from "../multer-config";

const router = express.Router();

const upload = multer({ storage });

router.post("/create", isAuthenticated, createConversation);
router.post(
	"/create/group-chat",
	upload.single("groupChatPhoto"),
	isAuthenticated,
	createGroupChat
);
router.get("/all", isAuthenticated, getAllConversations);

// TODO - add middleware:
router.get("/:conversationID", isAuthenticated, getConversationByID);
router.get("/:conversationID/messages", isAuthenticated, getAllChatMessages);
router.get("/:conversationID/data", isAuthenticated, getConversationData);
router.delete("/:conversationID/remove", isAuthenticated, deleteConversation);

export default router;
