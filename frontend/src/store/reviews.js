import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/GET_REVIEWS";
const POST_REVIEW = "reviews/POST_REVIEW";
const DELETE_REVIEW = 'reviews/deleteReview'

export const getReviews = (spotId, payload) => {
    return {
        type: GET_REVIEWS,
        payload,
        spotId,
    };
};

export const postReview = (spotId, payload) => {
    return {
        type: POST_REVIEW,
        payload,
        spotId,
    };
};

export const deleteReview = (payload) => {
  return {type:DELETE_REVIEW, payload}
}

export const getReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getReviews(spotId, data.Reviews));
        // return data;
    } else {
        if (res.message) {
            console.log("ERROR", res.message);
        }
        // const data = await res.json();
        // return data;
    }
};

export const postReviewThunk = (spotId, payload) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const data = await res.json();
        console.log("NEWREVIEWRESDATA", data);
        dispatch(postReview(data));
    }
    if (!res.ok) {
        console.log("ERROR", res.message);
    }
};

export const deleteReviewThunk = (reviewId) => async(dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method:'DELETE',
    headers:{
      'Content-Type':'application/json'
    },
  })

  if(res.ok){
    const data = await res.json()
    dispatch(deleteReview(data))
  }
}

const initialState = {};

export default function reviewsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_REVIEWS: {
            //    return { ...state, ...action.reviews };
            // }
            return {
                ...state,
                [action.spotId]: action.payload,
            };
        }
        case POST_REVIEW:
            return {
                ...state,
                [action.spotId]: 
                    // ...(state[action.spotId] || []),
                    action.payload,
            };
    case DELETE_REVIEW:
      delete [action.payload.id]
      return {...state}
        default:
            return state;
    }
}
