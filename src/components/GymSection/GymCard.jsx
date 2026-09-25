function GymCard({gym}) {
  const { title, address, days, time } = gym; 
    const shortDays = { понедельник: 'пн', вторник: 'вт', среда: 'ср', четверг: 'чт', пятница: 'пт', суббота: 'сб', воскресенье: 'вс' };
    const schedule = days.map((day) => <span className="gym__card__day" key={day} title={day}>{shortDays[day] || day}</span>);
    return (
      <div className="gym__card">
        <h3>{title}</h3>
        <p className="gym__card__address">{address}</p>
        <div className="gym__card__days">{schedule}</div>
        <div className="gym__card__time">{time}</div>
      </div>
    );
}

export default GymCard;