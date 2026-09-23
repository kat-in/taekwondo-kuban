import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "../../utils/api";
import { BELTS } from "../../utils/belts";

const emptyAttestation = () => BELTS.reduce((acc, belt) => ({ ...acc, [belt]: '' }), {})

const MarkdownHint = () => (
  <details className="admin-form__hint">
    <summary>Подсказка по Markdown</summary>
    <ul className="admin-form__hint-list">
      <li><code># Заголовок</code> · <code>## Подзаголовок</code> — заголовки</li>
      <li><code>**жирный**</code> — жирный, <code>*курсив*</code> — курсив</li>
      <li><code>- пункт</code> — маркированный список</li>
      <li><code>1. пункт</code> — нумерованный список</li>
      <li><code>[текст](https://ссылка)</code> — ссылка</li>
      <li>два пробела в конце строки или пустая строка — перенос строки</li>
    </ul>
  </details>
)

const NewsForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    category: '',
    date: '',
    content: '',
    imageDescription: '',
    albumId: '',
    videoId: '',
    removeImage: false,
    attestation: emptyAttestation(),
  })
  const [coverFile, setCoverFile] = useState(null)
  const [isCoverOpen, setIsCoverOpen] = useState(false)
  const [existingImage, setExistingImage] = useState(null)
  const [albums, setAlbums] = useState([])
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [newsData, albumsData, videosData] = await Promise.all([
          adminFetch('/news'),
          adminFetch('/albums'),
          adminFetch('/video'),
        ])
        setAlbums(albumsData)
        setVideos(videosData)
        setCategories([...new Set(newsData.map((item) => item.category).filter(Boolean))].filter((c) => c !== 'Фестиваль'))
        if (isEdit) {
          const current = newsData.find((item) => item.id === Number(id))
          if (current) {
            setForm({
              title: current.title || '',
              category: current.category || '',
              date: current.date || '',
              content: current.content || '',
              imageDescription: current.image?.description || '',
              albumId: albumsData.find((a) => a.newsId === current.id)?.id || '',
              videoId: videosData.find((v) => v.newsId === current.id)?.id || '',
              removeImage: false,
              attestation: BELTS.reduce(
                (acc, belt) => ({ ...acc, [belt]: current.attestation?.[belt] != null ? current.attestation[belt] : '' }),
                {}
              ),
            })
            setExistingImage(current.image || null)
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

  const handleAttestationChange = (belt, value) => {
    setForm((prev) => ({ ...prev, attestation: { ...prev.attestation, [belt]: value } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const body = new FormData()
      body.append('title', form.title)
      body.append('category', form.category)
      body.append('date', form.date)
      body.append('content', form.content)
      if (isCoverOpen || existingImage || coverFile) body.append('imageDescription', form.imageDescription)
      body.append('albumId', form.albumId || '')
      body.append('videoId', form.videoId || '')
      const attestationData = form.attestation
      const attestationResult = BELTS.reduce(
        (acc, belt) => {
          const value = attestationData?.[belt]
          if (value !== undefined && value !== null && value !== '') acc[belt] = Number(value)
          return acc
        },
        {}
      )
      body.append('attestation', JSON.stringify(attestationResult))
      if (coverFile) body.append('cover', coverFile)
      if (form.removeImage) body.append('removeImage', '1')

      await adminFetch(isEdit ? `/news/${id}` : '/news', { method: isEdit ? 'PUT' : 'POST', body })
      navigate('/admin/news')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h1 className="admin-form__title">{isEdit ? 'Редактировать новость' : 'Новая новость'}</h1>

      {error && <p className="admin-form__error">{error}</p>}

      <label className="admin-form__field">
        <span>Заголовок</span>
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Категория</span>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">— выберите категорию —</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="admin-form__field">
          <span>Дата (YYYY-MM-DD)</span>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
        </label>
      </div>

      <label className="admin-form__field">
        <span>Содержание (Markdown)</span>
        <textarea name="content" rows={8} value={form.content} onChange={handleChange} />
        <MarkdownHint />
      </label>

      {form.category === 'Аттестация' && (
        <fieldset className="admin-form__attestation">
          <legend>Результаты аттестации</legend>
          <div className="admin-form__attestation-list">
            {BELTS.map((belt) => (
              <label key={belt} className="admin-form__attestation-row">
                <span>{belt}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.attestation[belt]}
                  placeholder="0"
                  onChange={(e) => handleAttestationChange(belt, e.target.value.replace(/\D/g, ''))}
                />
                <span className="admin-form__attestation-unit">чел.</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Прикрепить альбом</span>
          <select name="albumId" value={form.albumId} onChange={handleChange}>
            <option value="">— без альбома —</option>
            {albums
              .filter((a) => !a.newsId || (isEdit && a.newsId === Number(id)))
              .map((a) => (
                <option key={a.id} value={a.id}>{a.date ? `${a.title} (${a.date})` : a.title}</option>
              ))}
          </select>
        </label>
        <label className="admin-form__field">
          <span>Прикрепить видео</span>
          <select name="videoId" value={form.videoId} onChange={handleChange}>
            <option value="">— без видео —</option>
            {videos
              .filter((v) => !v.newsId || (isEdit && v.newsId === Number(id)))
              .map((v) => (
                <option key={v.id} value={v.id}>{v.date ? `${v.title} (${v.date})` : v.title}</option>
              ))}
          </select>
        </label>
      </div>

      {(isCoverOpen || existingImage || coverFile) && (
        <div className="admin-form__row">
          <label className="admin-form__field">
            <span>Описание обложки</span>
            <input name="imageDescription" value={form.imageDescription} onChange={handleChange} placeholder="Кто на фото?" />
          </label>
          <label className="admin-form__field">
            <span>Обложка</span>
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0] || null)} />
          </label>
        </div>
      )}

      {!existingImage && !coverFile && (
        <div className="admin-form__actions">
          <button type="button" className="admin-btn admin-btn_dashed" onClick={() => setIsCoverOpen((open) => !open)}>
            {isCoverOpen ? 'Скрыть обложку' : 'Добавить обложку (опционально)'}
          </button>
        </div>
      )}

      {existingImage && !coverFile && (
        <div className="admin-form__preview">
          <img src={existingImage.url} alt="Обложка" />
          <label className="admin-form__checkbox">
            <input
              type="checkbox"
              checked={form.removeImage}
              onChange={(e) => setForm((prev) => ({ ...prev, removeImage: e.target.checked }))}
            />
            Удалить обложку
          </label>
        </div>
      )}
      {coverFile && (
        <div className="admin-form__preview">
          <img src={URL.createObjectURL(coverFile)} alt="Новая обложка" />
        </div>
      )}

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn admin-btn_primary" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" className="admin-btn" onClick={() => navigate('/admin/news')}>Отмена</button>
      </div>
    </form>
  )
}

export default NewsForm