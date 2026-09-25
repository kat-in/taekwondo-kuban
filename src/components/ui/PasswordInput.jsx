import { useState } from 'react'

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 4l16 16"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M9.9 5.9A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.3 4.1M6.6 7.9A16.8 16.8 0 0 0 2.5 12S6 18.5 12 18.5c1.3 0 2.4-.3 3.5-.7"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
)

const PasswordInput = ({ className = '', value, onChange, ...rest }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className={`password-field${className ? ` ${className}` : ''}`}>
      <input
        {...rest}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="password-field__input"
      />
      <button
        type="button"
        className="password-field__toggle"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        title={visible ? 'Скрыть пароль' : 'Показать пароль'}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

export default PasswordInput
