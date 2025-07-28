import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import { sendMessage } from "../controllers/message";

const router = express.Router();

import multer from "multer";
import storage from "../multer-config";
const upload = multer({ storage });

router.post("/send", isAuthenticated, upload.array("images", 4), sendMessage);

export default router;
