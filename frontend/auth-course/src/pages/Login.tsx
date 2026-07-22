import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login() {
    const { login, loginError, sucess } = useAuth();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        login(email, password)
    }

    return (
        <form action="" onSubmit={handleSubmit}>
            <h1>Login</h1>

            <label htmlFor="">Introduce tu email</label>
            <input type="email" required name="" id="" placeholder='email@email.com' onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="">Introduce tu contraseña</label>
            <input type="password" required name="" id="" placeholder='Contraseña aqui...' onChange={(e) => setPassword(e.target.value)} />

            <div>
                {loginError && <p style={{ 'color': 'red' }}>{loginError}</p>}
                {sucess && <p style={{ 'color': 'green' }}>{sucess.login}</p>}
            </div>

            <button type='submit'>Enviar</button>
        </form>
    )
}

export default Login
