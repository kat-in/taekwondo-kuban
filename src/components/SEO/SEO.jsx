import { Helmet } from "react-helmet-async"

const SITE_URL = "https://taekwondo-kuban.ru"
const DEFAULT_TITLE = "Тхэквондо Му Дук Кван — Краснодар"
const DEFAULT_DESCRIPTION = "Краснодарская городская ассоциация тхэквондо Му Дук Кван: новости, соревнования, аттестация, фото и видео."
const DEFAULT_IMAGE = `${SITE_URL}/hero_img.png`

const toAbsoluteUrl = (value, fallback) => {
  if (!value) return fallback
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`
}

const getPageUrl = () => {
  if (typeof window === "undefined") return SITE_URL
  return `${SITE_URL}${window.location.pathname}${window.location.search}`
}

const SEO = ({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE }) => {
  const pageTitle = title || DEFAULT_TITLE
  const pageDescription = description || DEFAULT_DESCRIPTION
  const pageImage = toAbsoluteUrl(image, DEFAULT_IMAGE)
  const pageUrl = getPageUrl()

  return (
    <Helmet>
      <html lang="ru" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  )
}

export default SEO
