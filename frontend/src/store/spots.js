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
      console.log("getSpotsThunk data.Spots:", data.Spots);
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
      dispatch(getSpotDetails(data));
    } else {
      throw res;
    }
  }
  catch (error) {
    const errorData = await res.json();
    dispatch(error(errorData));
  }
}

const initialState = { Spots: {}, SpotDetails: {}, loading: false, error: null};

const spotsReducer = (state = initialState, action) => {
  // console.log("spotsReducer action:", action);
  switch (action.type) {
    case GET_SPOTS: {
      const spotsById = action.payload.reduce((acc, spot) => {
        acc[spot.id] = spot;
        return acc;
      }, {});
      console.log("spotsById:", spotsById);
      return { ...state, Spots: spotsById, loading: false};
    }
    // case GET_SPOTS: {
    //   const spotsById =  { ...state, Spots: state.Spots, loading: true};
    //   // console.log("spotsById:", spotsById);
    //   action.payload.forEach(spot => {
    //     spotsById[spot.id] = spot;
    //   })
    //   return spotsById;
    // }
    case GET_SPOT_DETAILS: {
      const id = action.payload.id;
      return { ...state, SpotDetails: { ...state.SpotDetails, [id]: action.payload}, loading: false};
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
