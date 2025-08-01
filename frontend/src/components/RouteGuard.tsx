import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { ReactNode } from "react";
import Loading from "./Loading";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
	const { data: userData, isPending } = useCurrentUser();

	if (!userData && !isPending) {
		return <Navigate to="/sign-up" />;
	}

	if (isPending) return <Loading />;

	return <>{children}</>;
}
