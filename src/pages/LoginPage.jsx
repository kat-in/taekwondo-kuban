import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
    const inputRef = useRef(null)
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const logIn = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pass })
            })
            const data = await response.json()
            if (response.ok) {
                localStorage.setItem('token', data.token)
                navigate('/admin')
            } else {
                localStorage.removeItem('token')
                setError(data.message || 'Неверный пароль!')
            }
        } catch {
            setError('Ошибка соединения с сервером')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const closeModal = () => navigate('/')

    return (
        <div className="login__modal" onClick={closeModal}>
            <div className="login__modal-window" onClick={(e) => e.stopPropagation()}>
                <button className="login__modal-close" onClick={closeModal} type="button">×</button>
                <h2 className="login__modal-title">Вход для администратора</h2>
                <form className="login__modal-form" onSubmit={logIn}>
                    <input
                        name="password"
                        ref={inputRef}
                        type="password"
                        placeholder="Пароль"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        autoComplete="current-password"
                    />
                    {error && <p className="login__modal-error">{error}</p>}
                    <button type="submit" disabled={!pass || loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage