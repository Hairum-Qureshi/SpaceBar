import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./authentication/SignUp";
import SignIn from "./authentication/SignIn";
import Home from "./Home";
import Settings from "./Settings";
import NotFound from "./NotFound";
import "../css/index.css";
import useSocketStore from "../stores/useSocketStore";
import { useEffect } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { User } from "../interfaces";
import ProtectedRoute from "./RouteGuard";

export default function App() {
	const { connectSocket } = useSocketStore();
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
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/conversation/:conversationID"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings"
					element={
						<ProtectedRoute>
							<Settings />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
