import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
	const { data: userData } = useCurrentUser();

	if (!userData) {
		return <Navigate to="/sign-up" />;
	}

	return <>{children}</>;
}
