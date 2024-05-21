// SpotDetail.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import SpotReviews from "../SpotReviews";
import { TbBat } from "react-icons/tb";
import styles from "./SpotDetail.module.css";

const SpotDetail = () => {
    const { spotId: spotIdParam } = useParams();
    const spotId = Number(spotIdParam);
    const spot = useSelector((state) => state.spots[spotId]);
    const previewImage = useSelector((state) =>
        state.spots[spotId]?.SpotImages?.find((image) => image.preview)
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(spotActions.getSpotDetailsThunk(spotId));
        return () => {};
    }, [dispatch, spotId]);

    const handleClickReserve = () => {
        return window.alert("Feature coming soon");
    };

    return (
        <div className={styles.spotDetailPage}>
            {/* A. CONTAINER */}
            <div className={styles.spotDetailContainer}>
                <h1 className={styles.spotName}>{spot?.name}</h1>
                <div className={styles.location}>
                    {spot?.city}, {spot?.state}, {spot?.country}
                </div>
                {/*  A. IMAGE GALLERY */}
                <div className={styles.imageGallery}>
                    <div className={styles.mainImage}>
                        <img
                            src={previewImage?.url}
                            alt={spot?.name}
                            title={spot?.name}
                            className={styles.largeImage}
                        />
                    </div>
                    <div className={styles.sideImages}>
                        {spot?.SpotImages?.slice(1, 5).map((image) => (
                            <div className={styles.gridItem} key={image.id}>
                                <img
                                    src={image.url}
                                    alt={spot?.name}
                                    title={spot?.name}
                                    className={styles.gridImage}
                                />
                            </div>
                        ))}
                    </div>
                </div>{" "}
                {/* Z. IMAGE GALLERY */}
                {/* A. LOWER DETAILS */}
                <div className={styles.lowerContainer}>
                    <div className={styles.hostedBy}>
                        Hosted by {spot?.Owner?.firstName}{" "}
                        {spot?.Owner?.lastName}
                    </div>
                    <div className={styles.description}>
                        <p>{spot?.description}</p>
                    </div>
                    <div className={styles.priceResContainer}>
                        <div className={styles.price}>
                            ${spot?.price} night
                        </div>
                        <TbBat />
                        {spot && spot.avgRating != null && (
                            <>
                                {" "}
                                {typeof spot.avgRating === "number"
                                    ? spot.avgRating.toFixed(1)
                                    : parseFloat(spot.avgRating).toFixed(1)}
                            </>
                        )}
                        {spot?.numReviews ? (
                            <> · {spot?.numReviews}</>
                        ) : (
                            <> New</>
                        )}
                        {spot?.numReviews === 1 && <> Review</>}
                        {spot?.numReviews > 1 && <> Reviews</>}
                        <button
                            onClick={handleClickReserve}
                            className={styles.reserveButton}
                        >
                            Reserve
                        </button>
                    </div>
                    {/* A. SPOTREVIEWS.JSX */}
                    <div className={styles.reviewContainer}>
                    <SpotReviews className={styles.reviewContainer} spotId={spotId} />
                    </div>
                    {/* Z. SPOTREVIEWS.JSX */}
                </div>
                {/* Z. LOWER DETAILS */}
            </div>
            {/* Z. CONTAINER */}
        </div>
    );
};

export default SpotDetail;
