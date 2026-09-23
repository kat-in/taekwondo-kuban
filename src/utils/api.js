export const API_URL = '/api/admin'

export const getToken = () => localStorage.getItem('token')

export const logoutToLogin = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

export const adminFetch = async (url, options = {}) => {
  const token = getToken()
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${url}`, { ...options, headers })

  if (response.status === 401) {
    logoutToLogin()
    throw new Error('Сессия истекла')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Ошибка запроса')
  }
  return data
}