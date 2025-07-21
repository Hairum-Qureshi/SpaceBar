import express from "express";
import { getCurrentUser } from "../controllers/user";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();

router.get("/current-user", isAuthenticated, getCurrentUser);

export default router;
