import Markdown from 'react-markdown'
import aboutTaekwandoData from '../data/aboutTaekwandoData'

const AboutTaekwandoSection = () => {
    const { title, p1, p2, p3 } = aboutTaekwandoData

    return (
        <section className='about-taekwando'>
            <div className='about-taekwando__section'>
                <div className='about-taekwando__content'>
                    <Markdown>{p1}</Markdown>
                    <Markdown>{p2}</Markdown>
                    <Markdown>{p3}</Markdown>
                </div>

            </div>

        </section>
    )
}

export default AboutTaekwandoSection