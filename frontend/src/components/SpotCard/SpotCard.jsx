// SpotCard.js
import { Link } from 'react-router-dom';
import { TbBat } from 'react-icons/tb';
// import styles from '../ComponentsCss.module.css';
import styles from './SpotCard.module.css';

const SpotCard = ({ spot }) => {
  return (
    <div className={styles.card}>
      <Link to={`/spots/${spot.id}`}>
         <img src={spot.previewImage} alt={spot.name} title="SHOW ME YOUR TIPS!!!" className={styles.image} />
         <div className={styles.info}>
             <div className={styles.topRow}>
               <h3>{spot.city}, {spot.state}</h3>
               <div className={styles.rating}>
                  <span className={styles.star}><TbBat /></span>{spot.avgRating.toFixed(1)}
               </div>
             </div>
             <div className={styles.bottomRow}>
               <p className={styles.price}>${spot.price} per night</p>
             </div>
           </div>
      </Link>
    </div>
  );
};

export default SpotCard;
