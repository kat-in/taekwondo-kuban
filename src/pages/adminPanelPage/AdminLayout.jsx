import { NavLink, Outlet } from "react-router-dom";
import { logoutToLogin } from "../../utils/api";

const navItems = [
  { to: '/admin/news', end: false, label: 'Новости' },
  { to: '/admin/albums', end: false, label: 'Альбомы' },
  { to: '/admin/videos', end: false, label: 'Видео' },
]

const AdminLayout = () => {
  const handleLogout = () => logoutToLogin()

  return (
    <main className="admin">
      <div className="admin__topbar">
        <h1 className="admin__title">Панель администратора</h1>
        <button className="admin__logout" onClick={handleLogout}>Выйти</button>
      </div>
      <div className="admin__body">
        <aside className="admin__sidebar">
          <nav className="admin__nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `admin__nav-link${isActive ? ' admin__nav-link_active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <details className="admin__hint">
            <summary className="admin__hint-summary">Подсказка</summary>
            <div className="admin__hint-content">
              <p>Новости, альбомы и видео можно добавлять независимо друг от друга.</p>
              <p>Чтобы фото и видео отображались в новости, свяжите новость с нужным альбомом или видео.</p>
              <p>С каждой новостью может быть связан только один альбом и/или несколько видео.</p>
            </div>
          </details>
          <div className="admin__sidebar-footer">
            <NavLink
              to="/admin/password"
              className={({ isActive }) => `admin__sidebar-link${isActive ? ' admin__sidebar-link_active' : ''}`}
            >
              <svg
                className="admin__sidebar-link-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 10V8a5 5 0 0 1 10 0v2M5 10h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span>Смена пароля</span>
            </NavLink>
          </div>
        </aside>
        <section className="admin__content">
          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default AdminLayout