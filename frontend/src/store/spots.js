import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
const ERROR = 'spots/ERROR';

export const getSpots = (payload) => {
  return {
    type: GET_SPOTS,
    payload,
  }
};

export const getSpotDetails = (payload) => {
  return {
    type: GET_SPOT_DETAILS,
    payload,
  }
};

// need separate error actions for each fetch
export const error = (error) => {
  return {
    type: ERROR,
    error,
  }
};

export const getSpotsThunk = () => async (dispatch) => {
  // try {
    const res = await csrfFetch('/api/spots');
    if (res.ok) {
      const data = await res.json();
      // console.log("getSpotsThunk data.Spots:", data.Spots);
      dispatch(getSpots(data.Spots));
    } 
  //  else {
  //     throw res;
  //   }
  // }
  // catch (error) {
  //   const errorData = await res.json();
  //   dispatch(error(errorData));
  // }
};

export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if (res.ok) {
      const data = await res.json();
      console.log("getSpotDetailsThunk data:", data);
      dispatch(getSpotDetails(data));
         return data;
     } 
    else {
         console.log("NOT GETTING SPOT DETAILS");
      throw res;
    }
  }
  catch (error) {
    const errorData = await res.json();
    dispatch(error(errorData));
  }
}

// const initialState = { Spots: {}, SpotDetails: {}, loaded: false, error: null};
const initialState = {};

const spotsReducer = (state = initialState, action) => {
  // console.log("spotsReducer action:", action);
  switch (action.type) {
  //   case GET_SPOTS: {
  //     const spotsById = action.payload.reduce((acc, spot) => {
  //       acc[spot.id] = spot;
  //       return acc;
  //     }, {});
  //     console.log("spotsById:", spotsById);
  //     return { ...state, Spots: spotsById, loaded: true};
  //   }
    //
    // case GET_SPOTS: {
    //      console.log("GET_SPOTS action.payload:", action.payload);
    //   const spotsById  = {};
    //     action.payload.forEach(spot => {
    //     spotsById[spot.id] = spot;
    //   })
    //
    //   console.log("spotsById:", spotsById);
    //
    //   return { ...state, Spots: spotsById, loaded: true};
    // }

    case GET_SPOTS: {
         console.log("GET_SPOTS action.payload:", action.payload);
         console.log("state:", state);
      const newState = {...state /*, spots: {...state.spots} */};
         console.log("newState:", newState);
        action.payload.forEach(spot => {
        newState[spot.id] = spot;
      })

      console.log("newState:", newState);

      return newState;
    }

    case GET_SPOT_DETAILS: {
         console.log("GET_SPOT_DETAILS action.payload:", action.payload);
      const id = action.payload.id;
      return { ...state, [id]: action.payload};
    }
    case ERROR: {
      return { ...state, error: action.error, loading: false};
    }
    default:
      return state;
  }
}

// const spotsReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case GET_SPOTS:
//       return { Spots: action.payload.Spots };
//     case GET_SPOT_DETAILS:
//         return {...state, [action.payload.id]:action.payload}
//     default:
//       return state;
//   }
// };

export default spotsReducer;
