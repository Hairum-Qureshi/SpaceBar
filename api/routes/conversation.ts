import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import {
	createConversation,
	getAllChatMessages,
	getAllConversations,
	getConversationByID
} from "../controllers/conversation";

const router = express.Router();

router.post("/create", isAuthenticated, createConversation);
router.get("/all", isAuthenticated, getAllConversations);

// TODO - add middleware:
router.get("/:conversationID", isAuthenticated, getConversationByID);
router.get("/:conversationID/messages", isAuthenticated, getAllChatMessages);

export default router;
