import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import { createConversation } from "../controllers/conversation";

const router = express.Router();

router.post("/create", isAuthenticated, createConversation);

export default router;
