import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
    const { user, logout } = useAuth()

    return (
        <>
        <h1>Dashboard privad {user?.name}</h1>
        <button onClick={logout}>Cerrar sesion</button>
        </>
    )
}