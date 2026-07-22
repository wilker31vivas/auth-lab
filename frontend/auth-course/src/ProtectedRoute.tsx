import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { loading, user } = useAuth();

    if (loading === false && user === null) {
        return <Navigate to='/login' replace />
    }

    if (loading === false && user !== null) {
        return children
    }
}