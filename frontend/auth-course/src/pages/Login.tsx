import { useState } from 'react'

function LoginForm({ onSubmit, error }: { onSubmit: (email: string, password: string) => void, error: string | null }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onSubmit(email, password)
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
            </div>

            <button type='submit'>Enviar</button>
        </form>
    )
}

export default LoginForm
