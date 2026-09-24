import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "../../utils/api";
import { BELTS } from "../../utils/belts";
import Calendar from "../../components/ui/Calendar";
import { formatDate, getTodayDate, sortByDateDesc } from "../../utils/date";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024

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
    videoIds: [],
    removeImage: false,
    attestation: emptyAttestation(),
  })
  const [coverFile, setCoverFile] = useState(null)
  const coverInputRef = useRef(null)
  const [existingImage, setExistingImage] = useState(null)
  const [albums, setAlbums] = useState([])
  const [videos, setVideos] = useState([])
  const [videoToAdd, setVideoToAdd] = useState('')
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const isNewsFormValid = Boolean(form.title.trim() && form.category && form.date && form.content.trim())

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [newsData, albumsData, videosData] = await Promise.all([
          adminFetch('/news'),
          adminFetch('/albums'),
          adminFetch('/video'),
        ])
        setAlbums(sortByDateDesc(albumsData))
        setVideos(sortByDateDesc(videosData))
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
              videoIds: videosData.filter((v) => v.newsId === current.id).map((v) => v.id),
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

  const handleCoverFile = (e) => {
    const file = e.target.files[0] || null
    if (file && file.size > MAX_IMAGE_SIZE) {
      setError(`Файл «${file.name}» больше 10 МБ`)
      e.target.value = ''
      setCoverFile(null)
      return
    }

    setError('')
    setCoverFile(file)
    setForm((prev) => ({ ...prev, removeImage: false }))
  }

  const handleAddVideo = () => {
    if (!videoToAdd) return
    setForm((prev) => ({ ...prev, videoIds: [...new Set([...prev.videoIds, Number(videoToAdd)])] }))
    setVideoToAdd('')
  }

  const handleRemoveVideo = (videoId) => {
    setForm((prev) => ({ ...prev, videoIds: prev.videoIds.filter((id) => id !== videoId) }))
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
      if (existingImage || coverFile) body.append('imageDescription', form.imageDescription)
      body.append('albumId', form.albumId || '')
      body.append('videoIds', JSON.stringify(form.videoIds))
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

  const selectedVideos = videos.filter((video) => form.videoIds.includes(video.id))
  const availableVideos = videos.filter((video) => {
    const canAttach = !video.newsId || (isEdit && video.newsId === Number(id))
    return canAttach && !form.videoIds.includes(video.id)
  })

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h1 className="admin-form__title">{isEdit ? 'Редактировать новость' : 'Новая новость'}</h1>

      {error && <p className="admin-form__error">{error}</p>}

      <label className="admin-form__field">
        <span>Заголовок <b className="admin-form__required">*</b></span>
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Категория <b className="admin-form__required">*</b></span>
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">— выберите категорию —</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="admin-form__field">
          <span>Дата <b className="admin-form__required">*</b></span>
          <Calendar value={form.date} maxDate={getTodayDate()} required onChange={(value) => setForm((prev) => ({ ...prev, date: value }))} />
        </label>
      </div>

      <label className="admin-form__field">
        <span>Содержание (Markdown) <b className="admin-form__required">*</b></span>
        <textarea name="content" rows={8} value={form.content} onChange={handleChange} required />
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

      <div className="admin-form__attachments">
        <label className="admin-form__field">
          <span>Прикрепить альбом</span>
          <select name="albumId" value={form.albumId} onChange={handleChange}>
            <option value="">— без альбома —</option>
            {albums
              .filter((a) => !a.newsId || (isEdit && a.newsId === Number(id)))
              .map((a) => (
                <option key={a.id} value={a.id}>{a.date ? `${a.title} (${formatDate(a.date)})` : a.title}</option>
              ))}
          </select>
          <p className="admin-form__hint-text">Отображаются альбомы, не прикреплённые к другой новости, и текущий выбранный альбом.</p>
        </label>

        <label className="admin-form__field">
          <span>Добавить видео</span>
          <div className="admin-form__video-picker">
            <select value={videoToAdd} onChange={(event) => setVideoToAdd(event.target.value)}>
              <option value="">— выберите видео —</option>
              {availableVideos.map((video) => (
                <option key={video.id} value={video.id}>{video.date ? `${video.title} (${formatDate(video.date)})` : video.title}</option>
              ))}
            </select>
            <button type="button" className="admin-btn admin-btn_primary" onClick={handleAddVideo} disabled={!videoToAdd}>Добавить</button>
          </div>
          <div className="admin-form__selected-videos">
            <strong>Выбранные видео:</strong>
            {selectedVideos.length > 0 ? (
              <ul>
                {selectedVideos.map((video) => (
                  <li key={video.id}>
                    <span>{video.title}</span>
                    <button type="button" className="admin-btn admin-btn_small" onClick={() => handleRemoveVideo(video.id)}>Убрать</button>
                  </li>
                ))}
              </ul>
            ) : (
              <span>Видео не выбраны</span>
            )}
          </div>
          <p className="admin-form__hint-text">Можно выбрать несколько видео. В списке доступны видео, не прикреплённые к другой новости.</p>
        </label>
      </div>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Описание обложки</span>
          <input name="imageDescription" value={form.imageDescription} onChange={handleChange} placeholder="Кто на фото?" />
        </label>
        <label className="admin-form__field">
          <span>Обложка</span>
          <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverFile} />
          <p className="admin-form__hint-text">Обложка должна быть не больше 10 МБ.</p>
        </label>
      </div>


      <p className="admin-form__hint-text">Обложка внутри новости отображается как главная крупная фотография с подписью. Если обложка не выбрана, новость отобразится с первой фотографией из альбома или обложкой видео.</p>

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
          <button
            type="button"
            className="admin-btn admin-btn_danger admin-btn_small"
            onClick={() => { setCoverFile(null); if (coverInputRef.current) coverInputRef.current.value = ''; setForm((prev) => ({ ...prev, removeImage: false })) }}
          >
            Удалить
          </button>
        </div>
      )}

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn admin-btn_primary" disabled={saving || !isNewsFormValid}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" className="admin-btn" onClick={() => navigate('/admin/news')}>Отмена</button>
      </div>
    </form>
  )
}

export default NewsForm