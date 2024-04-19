import { csrfFetch } from './csrf';

// -------------------CONSTANTS-------------------
const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
const POST_SPOT = 'spots/POST_SPOT';
const ERROR = 'spots/ERROR';


// -------------------ACTIONS-------------------
// -------------------ACTIONS-------------------
// -------------------ACTIONS-------------------

// -------------------GET-------------------
export const getSpots = (payload) => {
  return {
    type: GET_SPOTS,
    payload,
  }
};

// -------------------GET DEEETS-------------------
export const getSpotDetails = (payload) => {
  return {
    type: GET_SPOT_DETAILS,
    payload,
  }
};

// -------------------POST-------------------
export const postSpot = (payload) => {
  return {
    type: POST_SPOT,
    payload,
  }
};

// -------------------ERROR-------------------
// need separate error actions for each fetch?
export const handleError = (error) => {
  return {
    type: ERROR,
    error,
  }
};

// -------------------THUNKS-------------------
// -------------------THUNKS-------------------
// -------------------THUNKS-------------------


// -------------------GET-------------------
// -------------------GET-------------------
export const getSpotsThunk = () => async (dispatch) => {
  try {
    const res = await csrfFetch('/api/spots');
    if (res.ok) {
      const data = await res.json();
      // console.log("getSpotsThunk data.Spots:", data.Spots);
      dispatch(getSpots(data.Spots));
    } 
  }
  catch (error) {
    console.log("ERROR IN GET SPOTS", error);
    dispatch(handleError(error));
  }
};


// -------------------DEEEETS-------------------
// -------------------DEEEETS-------------------
export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(getSpotDetails(data));
     } 
    }
  catch (error) {
    console.log("ERROR IN GETTING SPOT DETAILS", error);
    dispatch(handleError(error));
  }
}

// -------------------POST-------------------
// -------------------POST-------------------
export const postSpotThunk = (spot) => async (dispatch) => {
  try {
    const res = await csrfFetch('/api/spots', {
      method: 'POST',
      body: JSON.stringify(spot),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(postSpot(data));
    }
  }
  catch (error) {
    console.log("ERROR IN POSTING SPOT", error);
    dispatch(handleError(error));
  }
}

// -------------------REDUCER-------------------
// -------------------REDUCER-------------------
// -------------------REDUCER-------------------

const initialState = {};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {

// -------------------GET SPOTS-------------------
    case GET_SPOTS: {
      const newState = {...state };
         console.log("newState:", newState);
        action.payload.forEach(spot => {
        newState[spot.id] = spot;
      })

      return newState;
    }
// -------------------DETAILS-------------------
    case GET_SPOT_DETAILS: {
         console.log("GET_SPOT_DETAILS action.payload:", action.payload);
      const id = action.payload.id;
      return { ...state, [id]: action.payload};
    }
// -------------------POST SPOT-------------------
    case POST_SPOT: {
      return { ...state, [action.payload.id]: action.payload};
    }
// -------------------ERROR-------------------
    case ERROR: {
      return { ...state, error: action.error};
    }

    default:
      return state;
  }
}

export default spotsReducer;
