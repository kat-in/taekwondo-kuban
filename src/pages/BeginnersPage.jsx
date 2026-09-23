import GymMap from '../components/GymMap'
import Breadcrumbs from '../components/Breadcrumbs'

const BeginnersPage = () => {
    return (
        <main className="page__section">
            <div className="beginners__content">
                <Breadcrumbs />
                <h1>Информация для новичков</h1>
                <div className='divider'></div>
                <p>Мы принимаем в наши секции детей с 5 лет.</p>
                <p>При себе нужно иметь спортивную форму, а также медицинскую справку о том, что ребенок здоров и может заниматься спортом.</p>
                <p><b>Первая тренировка бесплатно.</b></p>
                <p>У нас вы можете приобрести форму для занятий (добок) и пояса.</p>
            <div className="beginners__dobok">
                <img src='./images/dobok/form1.jpg' />
                <img src='./images/dobok/form2.jpg' />
                <img src='./images/dobok/form3.jpg' />
                <img src='./images/dobok/form4.jpg' />
            </div>
         <GymMap/>
            </div>
    
        </main>

    )
}

export default BeginnersPage