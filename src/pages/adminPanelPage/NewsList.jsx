import { useNavigate } from "react-router-dom";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useAdminList } from "./AdminList";
import { formatDate, sortByDateDesc } from "../../utils/date";

const confirmDelete = (title) =>
  window.confirm(`Удалить новость «${title}»? Альбом и видео останутся в галерее.`)

const NewsList = () => {
  const navigate = useNavigate()
  const { items, error, loading, remove } = useAdminList('/news')
  const sorted = sortByDateDesc(items)

  const handleDelete = async (item) => {
    if (!confirmDelete(item.title)) return
    await remove(item.id)
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <>
      {error && <p className="admin-form__error">{error}</p>}

      <div className="admin-table">
        <div className="admin-table__row admin-table__row_head">
          <div className="admin-table__cell admin-table__cell_title">
            <h1 className="admin-list__title">Новости</h1>
          </div>
          <div className="admin-table__cell admin-table__cell_actions">
            <button
              className="admin-btn admin-btn_primary"
              onClick={() => navigate('/admin/news/new')}
            >
              Добавить новость
            </button>
          </div>
        </div>
        <div className="admin-table__row admin-table__row_subhead">
          <div className="admin-table__cell admin-table__cell_id">ID</div>
          <div className="admin-table__cell admin-table__cell_title">Заголовок</div>
          <div className="admin-table__cell admin-table__cell_mid">Категория</div>
          <div className="admin-table__cell admin-table__cell_mid">Дата</div>
          <div className="admin-table__cell admin-table__cell_actions">Действия</div>
        </div>
        {sorted.map((item) => (
          <div className="admin-table__row" key={item.id}>
            <div className="admin-table__cell admin-table__cell_id" data-label="ID">{item.id}</div>
            <div className="admin-table__cell admin-table__cell_title" data-label="Заголовок">{item.title}</div>
            <div className="admin-table__cell admin-table__cell_mid" data-label="Категория">{item.category}</div>
            <div className="admin-table__cell admin-table__cell_mid" data-label="Дата">{item.displayDate || formatDate(item.date)}</div>
            <div className="admin-table__cell admin-table__cell_actions" data-label="Действия">
              <button className="admin-icon-btn" title="Редактировать" onClick={() => navigate(`/admin/news/${item.id}/edit`)}><IconPencil size={18} /></button>
              <button className="admin-icon-btn admin-icon-btn_danger" title="Удалить" onClick={() => handleDelete(item)}><IconTrash size={18} /></button>
            </div>
            <div className="admin-table__mobile-meta">ID: {item.id} · Категория: {item.category || '—'} · Дата: {item.displayDate || formatDate(item.date)}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default NewsList