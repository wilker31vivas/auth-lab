import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function PublicRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    if (loading === true) return null;
    if (user) return <Navigate to='/dashboard' />;
    return children
}