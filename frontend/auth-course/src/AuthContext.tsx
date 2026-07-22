import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode;
}

interface User { id: number; email: string; name: string }

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true);
        setError(null);

            fetch('http://localhost:4001/api/auth/profile', {
                credentials: "include",
            }).then(response => {
                if (response.status === 401) {
                    setUser(null);
                    return null;
                }
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                return response.json();
            }).then(data => {
                if (data) {
                    if (data.error) {
                        setError(data.error)
                        return;
                    }
                    setUser(data)
                }
                return
            }).catch(error => {
                console.error("Fetch operation failed:", error.message);
                setError(error.message)
            }).finally(() => {
                setLoading(false)
            })
    }, [])

    const login = (email: string, password: string) => {
        fetch("http://localhost:4001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            if (data.error) {
                setError(data.error)
                return;
            }
            setUser(data)
        }).catch(error => {
            console.log("Hubo un problema con la petición Fetch:" + error.message);
        });
    }
    const logout = () => setUser(null);

    const value: AuthContextType = { user, login, logout, loading, error };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider ");
    }
    return context;
}
