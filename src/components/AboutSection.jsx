import aboutUsData from '../data/aboutUsData'
import Markdown from 'react-markdown'

const AboutSection = () => {
    const { title, text, activity, pullquote } = aboutUsData

    const aboutActivity = activity.map((item, i) => <div className="about__activity-item" key={i}><div className='about__activity-icon'></div><div className='about__activity-text'>{item}</div></div>)

    return (
        <section className='about'>
            <div className='about__section'>
                {/* <div className='about__title'><h2>{title}</h2></div> */}
                <div className='about__content'>
                    <div className='about__activity'>
                        <h4>Первое место в рейтинге городских спортивных объединений</h4>
                        <div className='about__activity-block'>{aboutActivity}</div>
                    </div>
                    <div className='about__text'>
                        <Markdown>{text}</Markdown>
                        <Markdown>{pullquote}</Markdown>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default AboutSection