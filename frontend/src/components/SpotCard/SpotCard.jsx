// SpotCard.js
import { Link } from "react-router-dom";
import { TbBat } from "react-icons/tb";
// import styles from '../ComponentsCss.module.css';
import styles from "./SpotCard.module.css";

const SpotCard = ({ spot }) => {
    return (
        <div className={styles.card}>
            <Link to={`/spots/${spot.id}`}>
                <div className={styles.imageContainer}>
                    <img
                        src={spot.previewImage}
                        alt={spot.name}
                        title={spot.name}
                        className={styles.image}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.topRow}>
                        <h3>
                            {spot.city}, {spot.state}
                        </h3>
                        <div className={styles.rating}>
                            <span className={styles.star}>
                                {spot?.avgRating ? (
                                    <>
                                        <TbBat />
                                        {spot && spot.avgRating != null && (
                                            <>
                                                {" "}
                                                {typeof spot.avgRating ===
                                                "number"
                                                    ? spot.avgRating.toFixed(1)
                                                    : parseFloat(
                                                          spot.avgRating
                                                      ).toFixed(1)}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <TbBat /> New
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className={styles.bottomRow}>
                        <p className={styles.price}>${spot.price} night</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default SpotCard;
