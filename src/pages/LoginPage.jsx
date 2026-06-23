import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
    const inputRef = useRef(null)
    const [pass, setPass] = useState('')
    const navigate = useNavigate()

    const getPass = (e) => {
        setPass(e.target.value)
    }

    const logIn = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const password = formData.get('password')
        console.log(password)
        const response = await fetch('/api/admin/login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pass }) // pass — значение из состояния
            })
        const data = await response.json();
        if (response.ok) {
            console.log('токен', data.token)
            localStorage.setItem('token', data.token);
            navigate('/admin');
        }
        else {
            localStorage.removeItem('token');
            const errorData = await response.json().catch(() => ({}));
            alert(errorData.error || 'Неверный пароль!');
        }
    }

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    return (
        <>
            <h2>Админ</h2>
            <form className="login_form" onSubmit={logIn}>
                <input name='password' ref={inputRef} onChange={getPass} type="password" placeholder="пароль" value={pass} />
                <button type="submit">Войти</button>
            </form>
        </>
    )
}

export default LoginPage