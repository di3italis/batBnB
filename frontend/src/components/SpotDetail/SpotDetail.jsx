import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import {
    getSpot,
    getCurrentUser,
    getSpotReviewsArray,
    getPreviewImage,
} from "../Selectors/Selectors.jsx"; // Import selectors
import OpenModalButton from "../OpenModalButton";
import NewReviewModal from "../NewReviewModal";
import SpotReviews from "../SpotReviews";
import { TbBat } from "react-icons/tb";
import styles from "./SpotDetail.module.css";

const SpotDetail = () => {
    const { spotId } = useParams();
    const currentSpotId = Number(spotId);
    const spot = useSelector((state) => getSpot(state, currentSpotId));
    const currentUser = useSelector(getCurrentUser);
    // const spotReviewsArray = useSelector((state) => getSpotReviewsArray(state, currentSpotId));
    const spotReviewsArray = useSelector((state) => state.reviews[currentSpotId]);
    const previewImage = useSelector((state) =>
        getPreviewImage(state, currentSpotId)
    );

    // console.log("spot", spot);

    const dispatch = useDispatch();

    useEffect(() => {
        // console.log("DISPATCHING");
        dispatch(spotActions.getSpotDetailsThunk(spotId));
        return () => {
            // console.log("CLEANING UP");
        };
    }, [dispatch, spotId]);

    const handleClickReserve = () => {
        return window.alert("Feature coming soon");
    };

    // console.log("RENDERING");
    return (
        <div className={styles.spotDetailPage}>
            <div className={styles.spotDetailContainer}>
                <h1 className={styles.spotName}>{spot?.name}</h1>
                <div className={styles.location}>
                    {spot?.city}, {spot?.state}, {spot?.country}
                </div>
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
                {/*  END imageGallery */}
                {/* START LOWER DETAILS */}
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
                            ${spot?.price} per night
                        </div>
                        <TbBat />
                        {spot && typeof spot.avgRating === "number" && (
                            <> {spot.avgRating.toFixed(1)}</>
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
                    <div className={styles.reviewContainer}>
                        <div className={styles.reviewHeader}>
                            <TbBat />
                            {spot && typeof spot.avgRating === "number" && (
                                <> {spot.avgRating.toFixed(1)}</>
                            )}
                            {spot?.numReviews ? (
                                <> · {spot?.numReviews}</>
                            ) : (
                                <> New</>
                            )}
                            {spot?.numReviews === 1 && <> Review</>}
                            {spot?.numReviews > 1 && <> Reviews</>}
                        </div>
                        {currentUser &&
                            currentUser?.id !== spot?.ownerId &&
                            !spotReviewsArray?.some(
                                (review) => review.userId === currentUser.id
                            ) && (
                                <div className="review-modal">
                                    {spot && currentUser !== null && (
                                        <OpenModalButton
                                            modalComponent={
                                                <NewReviewModal
                                                    spotId={spotId}
                                                />
                                            }
                                            buttonText={"Post Your Review"}
                                        />
                                    )}
                                </div>
                            )}
                        {!spot?.numReviews ? (
                            currentUser &&
                            currentUser?.id === spot?.ownerId && (
                                <SpotReviews spotId={spotId} />
                            )
                        ) : (
                            <SpotReviews />
                        )}
                        {spot?.numReviews === 0 && (
                            <h3>Be the first to post a review!</h3>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SpotDetail;
