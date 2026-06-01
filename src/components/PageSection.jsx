import cn from 'classnames'

const PageSection = ({children, title, theme}) => {
    const sectionClassnames = cn('page__section', theme)
    return (
        <div className={sectionClassnames}>
        <div className={`page__title_${theme}`}><h2>{title}</h2></div>
        {children}
        </div>
    )
}

export default PageSection