// SpotReviews.jsx
import * as reviewActions from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton";
import NewReviewModal from "../NewReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import { TbBat } from "react-icons/tb";
import styles from "./SpotReviews.module.css";

export default function SpotReviews({ spotId }) {
    const spot = useSelector((state) => state.spots[spotId]);
    const currentUser = useSelector((state) => state.session.user);
    const spotOwner = useSelector((state) => state.spots[spotId]?.ownerId);
    const spotReviews = useSelector((state) => state.reviews);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(reviewActions.getReviewsThunk(spotId)); // num or string?
    }, [dispatch, spotId]);

    const spotReviewsArray = spotReviews
        ? Object.values(spotReviews).filter(
              (review) => review.spotId === spotId
          )
        : [];
    console.log("ReviewsArr:", spotReviewsArray)

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: "long", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    const sortedReviews = spotReviewsArray.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
    })

    const canPostReview =
        currentUser &&
        currentUser.id !== spotOwner &&
        !spotReviewsArray.some((review) => review.userId === currentUser.id);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <TbBat />
                {spot && spotReviewsArray.length > 0 && (
                    <>
                        {" "}
                        {typeof spot.avgRating === "number"
                            ? spot.avgRating.toFixed(1)
                            : parseFloat(spot.avgRating).toFixed(1)}{" "}
                    </>
                )}
                {spot?.numReviews !== 0 ? <> · {spot.numReviews} </> : <> New</>}
                {spot?.numReviews === 1 && <> Review</>}
                {spot?.numReviews > 1 && <> Reviews</>}
            </div>
            {/* sub header */}
            {canPostReview && (
                <div className={styles.postReview}>
                    <OpenModalButton
                        buttonText={"Post Your Review"}
                        modalComponent={<NewReviewModal spotId={spotId} />}
                    />
                </div>
            )}
            {canPostReview && spotReviewsArray.length === 0 && (
                <div className={styles.noReviews}>
                    Be the first to post a review!
                </div>
            )}
            {/* REVIEWS */}
            {sortedReviews.map((review) => (
                <div className={styles.review} key={review.id}>
                    <div className={styles.reviewInfo}>
                        <div className={styles.reviewFirstName}>
                            {review.User?.firstName}
                        </div>
                        <div className={styles.reviewDate}>
                            {formatDate(review.createdAt)}
                        </div>
                        <div className={styles.reviewDescription}>
                            {review.review}
                        </div>
                    </div>
                    {currentUser?.id === review.userId &&
                        currentUser !== spotOwner && (
                            <OpenModalButton
                                buttonText={"Delete"}
                                modalComponent={
                                    <DeleteReviewModal
                                        reviewId={review.id}
                                        spotId={spotId}
                                    />
                                }
                            />
                        )}
                </div>
            ))}
        </div>
    );
}
