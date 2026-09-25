function GymMap() {
  return (
    <div className="gym-map">
      <div className="gym-map__frame">
        <iframe
          title="Карта адресов занятий"
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A1a44dd5b9e965dc01aec9fb2321eeeb262db148d8c51db6790e7673fc49df92f&amp;source=constructor"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default GymMap
