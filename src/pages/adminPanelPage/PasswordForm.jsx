import { useState } from 'react'
import { adminFetch, logoutToLogin } from '../../utils/api'
import PasswordInput from '../../components/ui/PasswordInput'

const PasswordForm = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', repeatPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.newPassword !== form.repeatPassword) {
      setError('Новый пароль и подтверждение не совпадают')
      return
    }
    setSaving(true)
    try {
      const result = await adminFetch('/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSuccess(result.message || 'Пароль изменён')
      setForm({ currentPassword: '', newPassword: '', repeatPassword: '' })
      setTimeout(logoutToLogin, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h1 className="admin-form__title">Смена пароля</h1>

      {error && <p className="admin-form__error">{error}</p>}
      {success && <p className="admin-form__success">{success}</p>}

      <label className="admin-form__field">
        <span>Текущий пароль</span>
        <PasswordInput
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
      </label>

      <label className="admin-form__field">
        <span>Новый пароль</span>
        <PasswordInput
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      <label className="admin-form__field">
        <span>Повторите новый пароль</span>
        <PasswordInput
          name="repeatPassword"
          value={form.repeatPassword}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      <p className="admin-form__hint">Минимум 8 символов, буквы и цифры.</p>

      <button className="admin-btn admin-btn_primary" type="submit" disabled={saving}>
        {saving ? 'Сохраняем...' : 'Сменить пароль'}
      </button>
    </form>
  )
}

export default PasswordForm
