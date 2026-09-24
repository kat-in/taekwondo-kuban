import { useNavigate } from "react-router-dom";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useAdminList } from "./AdminList";
import { formatDate, sortByDateDesc } from "../../utils/date";

const VideosList = () => {
  const navigate = useNavigate()
  const { items, error, loading, remove } = useAdminList('/video')
  const sorted = sortByDateDesc(items)

  const handleDelete = async (item) => {
    if (!window.confirm(`Удалить видео «${item.title}»?`)) return
    await remove(item.id)
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <>
      {error && <p className="admin-form__error">{error}</p>}

      <div className="admin-table">
        <div className="admin-table__row admin-table__row_head">
          <div className="admin-table__cell admin-table__cell_title">
            <h1 className="admin-list__title">Видео</h1>
          </div>
          <div className="admin-table__cell admin-table__cell_actions">
            <button
              className="admin-btn admin-btn_primary"
              onClick={() => navigate('/admin/videos/new')}
            >
              Добавить видео
            </button>
          </div>
        </div>
        <div className="admin-table__row admin-table__row_subhead">
          <div className="admin-table__cell admin-table__cell_id">ID</div>
          <div className="admin-table__cell admin-table__cell_title">Название</div>
          <div className="admin-table__cell admin-table__cell_mid">Rutube ID</div>
          <div className="admin-table__cell admin-table__cell_mid">Дата</div>
          <div className="admin-table__cell admin-table__cell_mid">Новость</div>
          <div className="admin-table__cell admin-table__cell_actions">Действия</div>
        </div>
        {sorted.map((item) => (
          <div className="admin-table__row" key={item.id}>
            <div className="admin-table__cell admin-table__cell_id" data-label="ID">{item.id}</div>
            <div className="admin-table__cell admin-table__cell_title" data-label="Название">{item.title}</div>
            <div className="admin-table__cell admin-table__cell_mid" data-label="Rutube ID">{item.videoId}</div>
            <div className="admin-table__cell admin-table__cell_mid" data-label="Дата">{formatDate(item.date)}</div>
            <div className="admin-table__cell admin-table__cell_mid" data-label="Новость">{item.newsId ?? '—'}</div>
            <div className="admin-table__cell admin-table__cell_actions" data-label="Действия">
              <button className="admin-icon-btn" title="Редактировать" onClick={() => navigate(`/admin/videos/${item.id}/edit`)}><IconPencil size={18} /></button>
              <button className="admin-icon-btn admin-icon-btn_danger" title="Удалить" onClick={() => handleDelete(item)}><IconTrash size={18} /></button>
            </div>
            <div className="admin-table__mobile-meta">ID: {item.id} · Дата: {formatDate(item.date)} · ID новости: {item.newsId ?? '—'}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default VideosList