// SpotCard.js
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import styles from '../ComponentsCss.module.css';

const SpotCard = ({ spot }) => {
  return (
    <div className={styles.spotCard}>
      <Link to={`/spots/${spot.id}`}>
        <div className={styles.imageContainer}>
          <img src={spot.previewImage} alt={spot.name} />
        </div>
        <div className={styles.spotInfo}>
          <div className={styles.spotInfoTop}>
            <span>{spot.city}, {spot.state}</span>
            <span className={styles.rating}>
              <FaStar className={styles.star} />
              {spot.avgRating.toFixed(1)}
            </span>
          </div>
          <div className={styles.spotInfoBottom}>
            <span className={styles.price}>${spot.price}</span>
            <span className={styles.perNight}>per night</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SpotCard;
