import express from "express";
import {
	deleteUserAccount,
	getCurrentUser,
	uploadProfilePicture
} from "../controllers/user";
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
// TODO - maybe have middleware to prevent other users from deleting another user's account?
router.delete("/account", isAuthenticated, deleteUserAccount);

export default router;
