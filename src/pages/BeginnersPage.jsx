import Markdown from "react-markdown"

const BeginnersPage = () => {
    return (
        <main className="page__section">
            <h1>Информация для новичков</h1>
           Мы принимаем в наши секции детей с 5 лет.<br/>
           При себе нужно иметь спортивную форму, а также медицинскую справку о том, что ребенок здоров и может заниматься спортом.<br/>
           <b>Первая тренировка бесплатно.</b>
           У нас вы можете приобрести форму для занятий (добок) и пояса.
            <div className="beginners_dobok">
                <img src='./images/dobok/form1.jpg' />
                <img src='./images/dobok/form2.jpg' />
                <img src='./images/dobok/form3.jpg' />
                <img src='./images/dobok/form4.jpg' />
            </div>

        </main>

    )
}

export default BeginnersPage