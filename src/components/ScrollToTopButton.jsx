import { useState, useEffect } from "react"

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

    return (
        <button
            className={`scroll-top${visible ? " scroll-top--visible" : ""}`}
            onClick={scrollToTop}
            aria-label="Наверх"
        >
            ↑
        </button>
    )
}

export default ScrollToTopButton