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
    sucess: Sucess
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
type Sucess = { register: null | string, login: null | string }

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
    const [sucess, setSucess] = useState<Sucess>({
        register: null,
        login: null
    })

    useEffect(() => {
        setLoading(true);
        setProfileError(null);

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
                    setProfileError(data.error)
                    return;
                }
                setUser(data)
            }
            return
        }).catch(error => {
            console.error("Fetch operation failed:", error.message);
            setProfileError(error.message)
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
                setLoginError(data.error)
                return;
            }
            setLoginError(null)
            setUser(data)
        }).catch(error => {
            console.log("Hubo un problema con la petición Fetch:" + error.message);
            setLoginError(error.message)
        });
    }
    const logout = () => setUser(null);

    const register = (name: string, email: string, password: string) => {
        fetch("http://localhost:4001/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password })
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            if (data.error) {
                setRegisterError(data.error)
                setSucess({
                    register: null,
                    login: null
                })
                return;
            }

            setSucess({
                register: 'Cuenta registrada correctamente!',
                login: null
            })
            setRegisterError(null)
            setTimeout(() => {
                login(email, password)
                setSucess({
                    register: null,
                    login: null
                })
            }, 2000)
        }).catch(error => {
            console.log("Hubo un problema con la petición Fetch:" + error.message);
        });
    }

    const value: AuthContextType = { user, login, register, logout, loading, loginError, registerError, profileError, sucess };

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
