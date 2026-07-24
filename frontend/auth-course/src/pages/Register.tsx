import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasowordError] = useState<null | string>(null)

    const { register, registerError, sucessRegister } = useAuth()

    useEffect(() => {
        if (password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword) {
            setPasowordError('Contraseña no coinciden')
        } else {
            setPasowordError(null)
        }
    }, [confirmPassword, password])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!passwordError) {
            register(name, email, password)
        }
    }

    return (
        <form action="" onSubmit={handleSubmit}>
            <h1>Register</h1>

            <label htmlFor="">Introduce tu nombre de usuario</label>
            <input type='text' required name="" id="" placeholder='Nombre aqui...' onChange={(e) => setName(e.target.value)} />

            <label htmlFor="">Introduce tu email</label>
            <input type="email" required name="" id="" placeholder='email@email.com' onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="">Introduce tu contraseña</label>
            <input type="password" required name="" id="" placeholder='Contraseña aqui...' onChange={(e) => setPassword(e.target.value)} />

            <label htmlFor="">Confirma tu contraseña</label>
            <input type="password" required name="" id="" placeholder='Contraseña aqui...' onChange={(e) => setConfirmPassword(e.target.value)} />

            <div>
                {passwordError && <p style={{ 'color': 'red' }}>{passwordError}</p>}
                {registerError && <p style={{ 'color': 'red' }}>{registerError}</p>}
                {sucessRegister && <p style={{ 'color': 'green' }}>{sucessRegister}</p>}
            </div>

            <button type='submit'>Enviar</button>
        </form>
    )
}

export default Register