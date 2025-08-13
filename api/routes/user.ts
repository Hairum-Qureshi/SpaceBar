import express from "express";
import { getCurrentUser, uploadProfilePicture } from "../controllers/user";
import isAuthenticated from "../middleware/isAuthenticated";
import multer from "multer";
import storage from "../configs/multer-config";

const router = express.Router();
const upload = multer({ storage });

router.get("/current-user", isAuthenticated, getCurrentUser);
router.post(
	"/upload/profile-picture",
	isAuthenticated,
	upload.single("profilePicture"),
	uploadProfilePicture
);

export default router;
