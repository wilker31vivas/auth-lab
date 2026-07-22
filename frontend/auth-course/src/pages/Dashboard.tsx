import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
    const { user } = useAuth()

    return (
        <h1>Dashboard privad {user?.name}</h1>
    )
}