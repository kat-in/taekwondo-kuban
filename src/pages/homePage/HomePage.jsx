import AboutSection from './AboutSection'
import AboutTaekwandoSection from './AboutTaekwandoSection'
import Hero from '../../components/Hero'
import LastNewsSection from '../../components/LastNewsSection'
import SEO from '../../components/SEO/SEO'
import PartnersSection from './PartnersSection'
import HomeInstructorsSection from './HomeInstructorsSection'

const HomePage = () => {
    return ( 
    <>
    <SEO title="Тхэквондо Му Дук Кван — Краснодар" description="Краснодарская городская ассоциация тхэквондо Му Дук Кван: новости, соревнования, аттестация, фото и видео." />
    <Hero />
    <AboutSection/>
    <AboutTaekwandoSection/>
    <HomeInstructorsSection/>
    <LastNewsSection/>
    <PartnersSection/>
  </>
    )
}

export default HomePage