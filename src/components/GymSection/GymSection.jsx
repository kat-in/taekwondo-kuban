import GymCard from './GymCard';
import GymMap from './GymMap';
import gymData from '../../data/gymsData';

function GymSection() {

    const gyms = gymData.map((gym) => <GymCard key={gym.id} gym={gym} />)

    return (
        <div className="gym__section">
            <div className="gym__cards">{gyms}</div>
            <GymMap />
        </div>
    )
}

export default GymSection;