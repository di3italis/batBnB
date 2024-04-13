import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots";
import SpotCard from "./SpotCard"; // A component to render individual spot

// import { Link } from 'react-router-dom';
// import { TbBat } from "react-icons/tb";
import "./HomeSpots.css";
// import styles from '../ComponentsCss.module.css';

export default function HomeSpots() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);

    useEffect(() => {
        dispatch(getSpotsThunk());
    });

    // console.log("spot 1:", spots[1]);

    if (!spots) {
        console.log("spots is null");
        return <div>Loading...</div>;
    }

    // return (
    //   <>
    //     <p>HomeSpots</p>
    //     <div>{spots.Spots.name}</div>
    //
    //   </>
    //   );
    // }

    // react app main needs to go somewhere else
    //   return (
    //     <div className={styles.spotsList}>
    //       {Object.values(spots).map((spot) => (
    //         <div key={spot.id} className={styles.spot}>
    //           <Link to={`/spots/${spot.id}`}>
    //             <img src={spot.previewImage} alt={spot.name} className={styles.spotImage} />
    //             <div className={styles.spotDetails}>
    //               <div className={styles.spotName}>{spot.name}</div>
    //               <div className={styles.spotLocation}>{spot.city}, {spot.state}</div>
    //               <div className={styles.spotPrice}>${spot.price} per night</div>
    //             </div>
    //           </Link>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }
    return (
        <div className="spotsHomePageContainer">
            {Object.values(spots.Spots).map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
            ))}
        </div>
    );
}
