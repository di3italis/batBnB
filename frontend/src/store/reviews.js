import { csrfFetch } from "./csrf";

// -------------------CONSTANTS-------------------
const GET_REVIEWS = "reviews/GET_REVIEWS";
const POST_REVIEW = "reviews/POST_REVIEW";
const DELETE_REVIEW = "reviews/deleteReview";

// -------------------ACTIONS-------------------

// -------------------GET ACTION-------------------
export const getReviews = (spotId, payload) => {
    return {
        type: GET_REVIEWS,
        spotId,
        payload,
    };
};

// -------------------POST ACTION-------------------
export const postReview = (spotId, payload) => {
    return {
        type: POST_REVIEW,
        spotId,
        payload,
    };
};

// -------------------DELETE ACTION-------------------
export const deleteReview = (reviewId) => {
    return { type: DELETE_REVIEW, reviewId };
};

// -------------------THUNKS-------------------

// -------------------GET REVIEWS THUNK-------------------
export const getReviewsThunk = (spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
        if (!res.ok) throw new Error("ERROR THUNKING REVIEWS");
        const { Reviews } = await res.json();
        const reviewsById = Reviews.reduce((acc, review) => {
            acc[review.id] = review;
            // console.log("REDUCED REVIEWS", acc);
            return acc;
        }, {});
        dispatch(getReviews(spotId, reviewsById));
    } catch (error) {
        console.error(error);
    }
};

// -------------------POST REVIEW THUNK-------------------
export const postReviewThunk = (spotId, payload) => async (dispatch) => {
    console.log("POST REVIEW THUNK", spotId, payload);
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
        const review = await res?.json();
        dispatch(postReview(spotId, review));
        }
    } catch (error) {
        console.error("ERROR POSTING REVIEW", error);
    }
};

// -------------------DELETE REVIEW THUNK-------------------
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        // const data = await res.json();
        // dispatch(deleteReview(data));
        dispatch(deleteReview(reviewId));
    }
};

// -------------------REDUCER-------------------
const initialState = {};

export default function reviewsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_REVIEWS: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case POST_REVIEW: {
            // const newState = structuredClone(state);
            return {
                [action.payload.id]: action.payload,
            }
        }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState[action.reviewId];
            return newState;
        }
        default:
            return state;
    }
}
