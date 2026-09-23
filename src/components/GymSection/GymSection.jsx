import GymCard from './GymCard';
import GymMap from './GymMap';
import gymData from '../../data/gymsData';

function GymSection() {

    const gyms = gymData.map((gym) => <GymCard key={gym.id} gym={gym}/>);
    console.log(gyms);
   

    return (
        <div className="gym__section">
        <div><GymMap/></div>
        <div className="gym__cards">{gyms}</div>
        </div>
    );
}

export default GymSection;