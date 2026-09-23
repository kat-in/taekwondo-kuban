import AboutSection from './AboutSection'
import AboutTaekwandoSection from './AboutTaekwandoSection'
import Hero from '../../components/Hero'
import PresidentSection from './PresidentSection'
import LastNewsSection from '../../components/LastNewsSection'
import PartnersSection from './PartnersSection'
import GymSection from '../../components/GymSection/GymSection'

const HomePage = () => {
    return ( 
    <>
    <Hero />
    <AboutSection/>
    <PresidentSection/>
    <AboutTaekwandoSection/>
    <GymSection/>
    <LastNewsSection/>
    <PartnersSection/>
  </>
    )
}

export default HomePage