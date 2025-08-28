import express from "express";
import {
	signIn,
	signInWithGoogle,
	signOut,
	signUp,
	signUpWithGoogle
} from "../controllers/authentication";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/google/sign-in", signInWithGoogle);
router.post("/google/sign-up", signUpWithGoogle);
router.post("/sign-out", isAuthenticated, signOut);

export default router;
