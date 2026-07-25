import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => void;
    register: (name: string, email: string, password: string) => void;
    logout: () => void;
    loading: boolean;
    loginError: string | null;
    profileError: string | null;
    registerError: string | null;
    sucessRegister: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode;
}

interface User { id: number; email: string; name: string }

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [sucessRegister, setSucessRegister] = useState<string | null>(null)

    const profile = async () => {
        try {
            const response = await fetch('http://localhost:4001/api/auth/profile', {
                credentials: "include",
            })

            const data = await response.json()

            if (response.status === 401) {
                setUser(null);
                return;
            }

            if (!response.ok) {
                setProfileError(data.error)
                return;
            }

            setUser(data)
        } catch (error: any) {
            console.error("Fetch operation failed:", error.message);
            setProfileError(error.message)
        } finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        setLoading(true);
        setProfileError(null);

        profile()
    }, [])

    //Cambiar la funcion .then() a async//await
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:4001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                setLoginError(data.error)
                return;
            }

            setLoginError(null)
            setUser(data)
        } catch (error) {
            setLoginError("No se pudo conectar con el servidor")
        }
    }

    const logout = () => setUser(null);

    //Cambiar la funcion .then() a async//await
    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:4001/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json()
            if (!response.ok) {
                setRegisterError(data.error)
                setSucessRegister(null)
                return
            }

            setSucessRegister('Cuenta registrada correctamente!',)
            setRegisterError(null)
            setTimeout(() => {
                login(email, password)
                setSucessRegister(null)
            }, 2000)
        } catch (error) {
            setRegisterError("No se pudo conectar con el servidor")
        }
    }

    const value: AuthContextType = { user, login, register, logout, loading, loginError, registerError, profileError, sucessRegister };

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
