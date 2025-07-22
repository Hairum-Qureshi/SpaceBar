import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import {
	createConversation,
	getAllConversations
} from "../controllers/conversation";

const router = express.Router();

router.post("/create", isAuthenticated, createConversation);
router.get("/all", isAuthenticated, getAllConversations);

export default router;
