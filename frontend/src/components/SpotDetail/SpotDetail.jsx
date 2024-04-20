import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import NewReviewModal from "../NewReviewModal";
import SpotReviews from "../SpotReviews";
import { TbBat } from "react-icons/tb";
import styles from "./SpotDetail.module.css";

export default function SpotDetail() {
    const { spotId } = useParams();
    const mySpotId = Number(spotId);
    // const state = useSelector((state) => state);
    const spot = useSelector((state) => state.spots[mySpotId]);
    const currentUser = useSelector((state) => state.session.user);
    // const spotReviews = useSelector((state) => state.reviews[mySpotId]);
    const spotReviewsArray = useSelector((state) => Object.values(state.reviews[mySpotId] || {}));

    // console.log("spotId:", spotId);
    // console.log("spot:", mySpotId);
    console.log("currentUser:", currentUser);
    // console.log("state.spots:", state.spots);
    // console.log("state.spots.SpotDetails", state.spots.SpotDetails);

    const dispatch = useDispatch();

    // useEffect(() => {
    //      dispatch(spotActions.getSpotsThunk())
    // }, [dispatch]);

    useEffect(() => {
        if (spotId) {
            dispatch(spotActions.getSpotDetailsThunk(spotId));
        }
    }, [dispatch, spotId]);

    if (!spot) {
        return <div>Spot not found</div>;
    }

    const handleClickReserve = () => {
        return window.alert("Feature coming soon");
    };

    console.log("spot:", spot);

    const previewImage = spot.SpotImages?.find((image) => image.preview);

    console.log("spotReviewsArray:", spotReviewsArray);
    return (
        <div className={styles.spotDetailPage}>
            <div className={styles.spotDetailContainer}>
                <h1 className={styles.spotName}>{spot.name}</h1>
                <div className={styles.location}>
                    {spot.city}, {spot.state}, {spot.country}
                </div>
                <div className={styles.imageGallery}>
                    <div className={styles.mainImage}>
                        <img
                            src={previewImage?.url}
                            alt={spot.name}
                            title={spot.name}
                            className={styles.largeImage}
                        />
                    </div>
                    <div className={styles.sideImages}>
                        {spot.SpotImages?.slice(1, 5).map((image) => (
                            <div className={styles.gridItem} key={image.id}>
                                <img
                                    src={image.url}
                                    alt={spot.name}
                                    title={spot.name}
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
                        Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
                    </div>
                    <div className={styles.description}>
                        <p>{spot?.description}</p>
                    </div>
                    <div className={styles.priceResContainer}>
                        <div className={styles.price}>
                            ${spot.price} per night
                        </div>
                        <TbBat />
                        {spot && spot.avgRating && (
                            <> {spot.avgRating.toFixed(1)}</>
                        )}
                        {spot.numReviews ? (
                            <> · {spot.numReviews}</>
                        ) : (
                            <> New</>
                        )}
                        {spot.numReviews === 1 && <> Review</>}
                        {spot.numReviews > 1 && <> Reviews</>}
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
                            {spot && spot.avgRating && (
                                <> {spot.avgRating.toFixed(1)}</>
                            )}
                            {spot.numReviews ? (
                                <> · {spot.numReviews}</>
                            ) : (
                                <> New</>
                            )}
                            {spot.numReviews === 1 && <> Review</>}
                            {spot.numReviews > 1 && <> Reviews</>}
                        </div>
                        {currentUser &&
                            currentUser.id !== spot?.ownerId &&
                            !spotReviewsArray?.some(
                                (review) => review.userId === currentUser.id
                            ) && (
                                <div className={styles.reviewModal}>
                                    {spot && currentUser !== null && (
                                        <OpenModalButton
                                            modalComponent={
                                                <NewReviewModal spotId={spotId} />
                                            }
                                            buttonText={"Post Your Review"}
                                        />
                                    )}
                                </div>
                            )}
                        {!spot.numReviews ? ((currentUser && currentUser.id === spot?.ownerId) || !currentUser ? (
                            <SpotReviews spotId={spotId} /> 
                            ) : (
                                <h3>Be the first to post a review!</h3>
                            )
                            ) : (
                            <SpotReviews />
                            )} {/* maybe pass spotId prop? */}
                    </div>
                </div>
            </div>
        </div>
    );
}
