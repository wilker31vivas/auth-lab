import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useLocation } from "react-router-dom";

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<undefined | string>(undefined)
    const [sucess, setSucess] = useState<undefined | string>(undefined)

    const location = useLocation();
    const { login, user } = useAuth()

    useEffect(() => {
        if (password !== confirmPassword) {
            setError('Contraseña no coinciden')
            setSucess(undefined)
        } else {
            setError(undefined)
        }
    }, [confirmPassword, password])

    if (location.pathname === "/login" && user !== null) {
        return <p>Estás en Login</p>;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!error) {
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
                    setError(data.error)
                    setSucess(undefined)
                    return;
                }

                setSucess('Cuenta registrada correctamente!')
                setError(undefined)
                setTimeout(() => {
                    login(email, password)
                    setSucess(undefined)
                }, 2000)
            }).catch(error => {
                console.log("Hubo un problema con la petición Fetch:" + error.message);
            });
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
                {error && <p style={{ 'color': 'red' }}>{error}</p>}
                {sucess && <p style={{ 'color': 'green' }}>{sucess}</p>}
            </div>

            <button type='submit'>Enviar</button>
        </form>
    )
}

export default Register