import { NavLink, Outlet, useLocation } from "react-router";
import { useState } from "react";
import cn from 'classnames'
import Breadcrumbs from "../../components/Breadcrumbs"

const links = [
    { title: 'Аттестация', link: '/materials/attestation' },
    { title: 'Кодекс чести', link: '/materials/codex' },
    { title: 'Правила поединка', link: '/materials/rules' },
    { title: 'Степени мастерства', link: '/materials/ranks' },
    { title: 'Значение пумсэ', link: '/materials/poomsae' },
    { title: 'Цвета поясов', link: '/materials/belt-colors' },
    { title: 'Словарик', link: '/materials/glossary' },
]

const MaterialsLayout = () => {
    const [activeLink, setActiveLink] = useState(0)
    const { pathname } = useLocation()
    const isGlossary = pathname === '/materials/glossary'

    const handleClick = (e) => {
        setActiveLink(Number(e.target.id))
    }

    const navLinks = links.map(({ title, link }, i) => {
        const isActive = activeLink === i
        const navLinkStyles = cn('materials__nav-link', { 'materials__nav-link_active': isActive })
        return (
            <NavLink onClick={handleClick} key={i} id={i} className={navLinkStyles} to={link}>{title}</NavLink>
        )

    })

    return (
        <main>
            <div className="materials__layout">
                <div className="materials__sidebar">
                    {navLinks}
                </div>

                <div className="materials__content">
                    <div className="materials__content-header">
                        <Breadcrumbs />
                        {isGlossary && (
                            <button className="glossary__print-button" onClick={() => window.print()}>Распечатать</button>
                        )}
                    </div>
                    <Outlet />
                </div>
            </div>
        </main>
    )
}
export default MaterialsLayout