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
        </aside>
        <section className="admin__content">
          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default AdminLayout