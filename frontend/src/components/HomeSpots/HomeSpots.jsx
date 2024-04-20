import { useEffect, /* useState */ } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots";
import SpotCard from "../SpotCard"; 
import styles from './HomeSpots.module.css';

export default function HomeSpots() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);
    // const [loaded, setLoaded] = useState(false);
   
   // console.log("spots:", spots);

    useEffect(() => {
        dispatch(getSpotsThunk())
      // .then(() => setLoaded(true))
    }, [dispatch]);

    // console.log("spot 1:", spots[1]);

    if (!spots) {
        // console.log("spots is null");
        return <div>Spots Not Found!</div>;
    }

    return (
        <div className={styles.main}>
            {Object.values(spots).map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
            ))}
        </div>
    );
}
