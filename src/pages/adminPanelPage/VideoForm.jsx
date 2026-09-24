import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "../../utils/api";
import Calendar from "../../components/ui/Calendar";
import { formatDate, getTodayDate, sortByDateDesc } from "../../utils/date";

const VideoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ title: '', videoId: '', date: '', newsId: '' })
  const [newsList, setNewsList] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const newsData = await adminFetch('/news')
        setNewsList(sortByDateDesc(newsData))
        if (isEdit) {
          const videosData = await adminFetch('/video')
          const current = videosData.find((item) => item.id === Number(id))
          if (current) {
            setForm({
              title: current.title || '',
              videoId: current.videoId || '',
              date: current.date || '',
              newsId: current.newsId || '',
            })
          }
        }
      } catch {
        setError('Не удалось загрузить данные')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await adminFetch(isEdit ? `/video/${id}` : '/video', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      navigate('/admin/videos')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h1 className="admin-form__title">{isEdit ? 'Редактировать видео' : 'Новое видео'}</h1>

      {error && <p className="admin-form__error">{error}</p>}

      <label className="admin-form__field">
        <span>Название</span>
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <label className="admin-form__field">
        <span>ID ролика Rutube</span>
        <input name="videoId" value={form.videoId} onChange={handleChange} placeholder="Например: 02cfb32e13fea65b0cc689cd0f9a58ae" required />
      </label>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Дата</span>
          <Calendar value={form.date} maxDate={getTodayDate()} onChange={(value) => setForm((prev) => ({ ...prev, date: value }))} />
        </label>
        <label className="admin-form__field">
          <span>Привязать к новости</span>
          <select name="newsId" value={form.newsId} onChange={handleChange}>
            <option value="">— без новости —</option>
            {newsList.map((n) => (
              <option key={n.id} value={n.id}>{n.date ? `${n.title} (${formatDate(n.date)})` : n.title}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn admin-btn_primary" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" className="admin-btn" onClick={() => navigate('/admin/videos')}>Отмена</button>
      </div>
    </form>
  )
}

export default VideoForm