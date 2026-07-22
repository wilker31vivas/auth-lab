import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useLocation, Navigate } from "react-router-dom";

function Login() {
    const { login, user } = useAuth();
    const location = useLocation();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<undefined | string>(undefined)
    const [sucess, setSucess] = useState<undefined | string>(undefined)


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        login(email, password)
    }

    if (location.pathname === "/login" && user !== null) {
        return <Navigate to='/dashboard' replace />
    }

    return (
        <form action="" onSubmit={handleSubmit}>
            <h1>Login</h1>

            <label htmlFor="">Introduce tu email</label>
            <input type="email" required name="" id="" placeholder='email@email.com' onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="">Introduce tu contraseña</label>
            <input type="password" required name="" id="" placeholder='Contraseña aqui...' onChange={(e) => setPassword(e.target.value)} />

            <div>
                {error && <p style={{ 'color': 'red' }}>{error}</p>}
                {sucess && <p style={{ 'color': 'green' }}>{sucess}</p>}
            </div>

            <button type='submit'>Enviar</button>
        </form>
    )
}

export default Login
