import * as reviewActions from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SpotReviews.module.css";

export default function SpotReviews() {
    const { spotId } = useParams();
    const mySpotId = Number(spotId);
    const reviews = useSelector((state) => state.reviews);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(reviewActions.getReviewsThunk(mySpotId));
    }, [dispatch, mySpotId]);

    if (!reviews) {
        return <div>Reviews not found</div>;
    }

    console.log("reviews:", reviews);
    return (
        <div>
            {Object.values(reviews).map((review) => (
                <div key={review.id}>
                    <div>{review.User.firstName}</div>
                    <div>{review.review}</div>
                </div>
            ))}
        </div>
    );
}
