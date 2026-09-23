import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "../../utils/api";
import { formatDate } from "../../utils/date";

const AlbumForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ title: '', date: '', newsId: '' })
  const [newsList, setNewsList] = useState([])
  const [currentPhotos, setCurrentPhotos] = useState([])
  const [newPhotos, setNewPhotos] = useState([])
  const [removedPhotos, setRemovedPhotos] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const newsData = await adminFetch('/news')
        setNewsList(newsData)
        if (isEdit) {
          const albumsData = await adminFetch('/albums')
          const current = albumsData.find((item) => item.id === Number(id))
          if (current) {
            setForm({ title: current.title || '', date: current.date || '', newsId: current.newsId || '' })
            setCurrentPhotos(current.photos || [])
            setRemovedPhotos([])
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

  const handleFiles = (e) => {
    setNewPhotos(Array.from(e.target.files || []))
  }

  const handleRemoveExisting = (url) => {
    setRemovedPhotos((prev) => [...prev, url])
  }

  const handleUndoRemove = (url) => {
    setRemovedPhotos((prev) => prev.filter((p) => p !== url))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const body = new FormData()
      body.append('title', form.title)
      body.append('date', form.date)
      body.append('newsId', form.newsId || '')
      body.append('removedPhotos', JSON.stringify(removedPhotos))
      newPhotos.forEach((file) => body.append('photos', file))

      await adminFetch(isEdit ? `/albums/${id}` : '/albums', { method: isEdit ? 'PUT' : 'POST', body })
      navigate('/admin/albums')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h1 className="admin-form__title">{isEdit ? 'Редактировать альбом' : 'Новый альбом'}</h1>

      {error && <p className="admin-form__error">{error}</p>}

      <label className="admin-form__field">
        <span>Название</span>
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Дата (YYYY-MM-DD)</span>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
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

      <label className="admin-form__field">
        <span>{isEdit ? 'Добавить фото' : 'Фото'}</span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} />
      </label>

      {isEdit && (
        <div className="admin-form__previews">
          {currentPhotos.map((url) => {
            const removed = removedPhotos.includes(url)
            return (
              <div key={url} className="admin-form__preview">
                <img src={url} alt="Фото альбома" />
                {removed ? (
                  <button type="button" className="admin-btn admin-btn_small" onClick={() => handleUndoRemove(url)}>
                    Вернуть
                  </button>
                ) : (
                  <button type="button" className="admin-btn admin-btn_danger admin-btn_small" onClick={() => handleRemoveExisting(url)}>
                    Удалить
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {newPhotos.length > 0 && (
        <div className="admin-form__previews">
          {newPhotos.map((file, index) => (
            <div key={`${file.name}-${index}`} className="admin-form__preview">
              <img src={URL.createObjectURL(file)} alt={file.name} />
            </div>
          ))}
        </div>
      )}

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn admin-btn_primary" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" className="admin-btn" onClick={() => navigate('/admin/albums')}>Отмена</button>
      </div>
    </form>
  )
}

export default AlbumForm