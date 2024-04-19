import { csrfFetch } from './csrf';

const GET_REVIEWS = 'reviews/GET_REVIEWS';
const POST_REVIEW = 'reviews/POST_REVIEW';




export const getReviews = (reviews) => {
   return {
      type: GET_REVIEWS,
      reviews,
   }
}

export const postReview = (review) => {
   return {
      type: POST_REVIEW,
      review,
   }
}

export const getReviewsThunk = (spotId) => async (dispatch) => {
   try {
      const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
      if (res.ok) {
         const data = await res.json();
         dispatch(getReviews(data.Reviews));
      } else {
         throw res;
      }
   } catch (error) {
      const errorData = await res.json();
      dispatch(error(errorData));
   }
}

export const postReviewThunk = (review) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${review.spotId}/reviews`,{
    method:'POST',
    header:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(review)
  })

  if(res.ok){
    const data = await res.json()
    dispatch(postReview(data))
    return data
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
}

const initialState = {};

export default function reviewsReducer(state = initialState, action) {
    switch (action.type) {
       case GET_REVIEWS: {
          return { ...state, ...action.reviews };
       }
       case POST_REVIEW: {
           return { ...state, [action.review.spotId]: action.review };
       }
       default:
          return state;
      }
}
