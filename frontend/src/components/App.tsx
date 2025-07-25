import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./authentication/SignUp";
import Home from "./Home";
import "../css/index.css";
import SignIn from "./authentication/SignIn";
import useSocketStore from "../stores/useSocketStore";
import { useEffect } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { User } from "../interfaces";

export default function App() {
	const { connectSocket } = useSocketStore();
	// const activeUsers = useSocketStore(state => state.activeUsers);
	const { data: userData } = useCurrentUser();

	useEffect(() => {
		if ((userData as User)?._id) {
			connectSocket(userData._id);
		}
	}, [userData]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/" element={<Home />} />
				<Route path="/conversation/:conversationID" element={<Home />} />
				{/* <Route path="*" element={<NotFound />} />  */}
			</Routes>
		</BrowserRouter>
	);
}
