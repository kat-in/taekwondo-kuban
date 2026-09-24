import { Link } from "react-router";
import { useLocation } from "react-router";

const PAGE_NAMES = {
    'beginners': 'Новичкам',
    'news': 'Новости',
    'materials': 'Знания',
    'about': 'О нас',
    'gallery': 'Фото и видео',
    'addresses': 'Адреса занятий',
    'ranks': 'Степени мастерства',
    'poomsae': 'Пумсэ',
    'belt-colors': 'Значение цвета пояса',
    'glossary': 'Словарик',
    'attestation': 'Аттестационная программа',
    'codex': 'Кодекс чести',
    'rules': 'Правила поединка',
}

function Breadcrumbs({ name }) {
    const location = useLocation();
    const segments = location.pathname.split('/').filter(Boolean);

    let crumbs = [];
    let path = '';
    segments.forEach((seg, i) => {
        path += `/${seg}`;
        const isLast = i === segments.length - 1;
        const label = isLast ? (name || PAGE_NAMES[seg] || seg) : (PAGE_NAMES[seg] || seg);
        crumbs.push({ path, label, isLast });
    });

    return (
        <div className="breadcrumbs">
<Link to="/">Главная</Link>
            {crumbs.map((crumb) => (
                <span key={crumb.path}>
                    <span className="breadcrumbs__sep">&#8250;</span>
                    {crumb.isLast
                        ? <span>{crumb.label}</span>
                        : <Link to={crumb.path}>{crumb.label}</Link>}
                </span>
            ))}
        </div>
    )
}

export default Breadcrumbs