function GymCard({gym}) {
  const { title, address, days, time } = gym; 
  const schedule = days.map((day) => <p className="gym__card__day" key={day}>{day}</p>);
  return (
    <div className="gym__card">
      
      <h3>{title}</h3>
      <p>{address}</p>
      <div className="gym__card__days">{schedule}</div>
      <div>{time}</div>
    </div>
  );
}

export default GymCard;