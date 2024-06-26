import { csrfFetch } from "./csrf";

// -------------------CONSTANTS-------------------
const GET_SPOTS = "spots/GET_SPOTS";
const GET_SPOT_DETAILS = "spots/GET_SPOT_DETAILS";
const GET_CURRENT_USER_SPOTS = "spots/getCurrentUserSpots";
const POST_SPOT = "spots/POST_SPOT";
const POST_IMAGE = "spots/POST_IMAGE";
const DELETE_SPOT = "spots/DELETE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const ERROR = "spots/ERROR";

// -------------------ACTIONS-------------------

// -------------------GET ACTION-------------------
export const getSpots = (payload) => {
    return {
        type: GET_SPOTS,
        payload,
    };
};
// -------------------DEEETS ACTION-------------------
export const getSpotDetails = (payload) => {
    return {
        type: GET_SPOT_DETAILS,
        payload,
    };
};
// -------------------GET CURRENT USER SPOTS ACTION-------------------
export const getCurrentUserSpots = (payload) => {
      return { 
        type: GET_CURRENT_USER_SPOTS, 
        payload 
    };
};
// -------------------POST ACTION-------------------
export const postSpot = (payload) => {
    return {
        type: POST_SPOT,
        payload,
    };
};

// -------------------POST IMG ACTION-------------------
export const postImage = (payload, spotId) => {
    return {
        type: POST_IMAGE,
        payload,
        spotId,
    };
};

// -------------------DELETE ACTION-------------------
export const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

// --------------UPDATE SPOT ACTION-------------
const updateSpot = (spot) => {
    return {
        type: UPDATE_SPOT,
        spot
    }
}

// -------------------ERROR ACTION-------------------
// need separate error actions for each fetch?
export const handleError = (error) => {
    return {
        type: ERROR,
        error,
    };
};


// -------------------THUNKS-------------------

// -------------------GET THUNK-------------------
export const getSpotsThunk = () => async (dispatch) => {
    try {
        const res = await csrfFetch("/api/spots");
        if (res.ok) {
            const data = await res.json();
            // console.log("getSpotsThunk data.Spots:", data.Spots);
            dispatch(getSpots(data.Spots));
        }
    } catch (error) {
        console.log("ERROR IN GET SPOTS", error);
        dispatch(handleError(error));
    }
};

// -------------------DEEEETS THUNK-------------------
export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}`);
        if (res.ok) {
            const data = await res.json();
            dispatch(getSpotDetails(data));
        }
    } catch (error) {
        console.log("ERROR IN GETTING SPOT DETAILS", error);
        dispatch(handleError(error));
    }
};

// -------------------GET CURRENT USER SPOTS THUNK-------------------
export const getCurrentUserSpotsThunk = () => async (dispatch) => {
    try {
        const res = await csrfFetch("/api/spots/current");
        if (res.ok) {
            const data = await res.json();
            console.log("getCurrentUserSpotsThunk data:", data.Spots);
            dispatch(getCurrentUserSpots(data.Spots));
            return data;
        }
    } catch (error) {
        console.log("ERROR IN GETTING CURRENT USER SPOTS", error);
        dispatch(handleError(error));
    }
};

// -------------------POST SPOT THUNK-------------------
export const postSpotThunk = (spot) => async (dispatch) => {
    try {
        console.log("postspotThunk:", spot);
        const res = await csrfFetch("/api/spots", {
            method: "POST",
            body: JSON.stringify(spot),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            const data = await res.json();
            dispatch(postSpot(data));
            return data;
        }
    } catch (error) {
        console.error("ERROR IN POSTING SPOT", error);
        dispatch(handleError(error));
    }
};

// -------------------POST IMG THUNK-------------------
export const postImageThunk = (newSpotId, payload) => async (dispatch) => {
    try {
        const imageData = { url: payload.url, preview: payload.preview };
        const res = await csrfFetch(`/api/spots/${newSpotId}/images`, {
            method: "POST",
            body: JSON.stringify(imageData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const imgRes = await res.json();
        dispatch(postImage(imgRes, payload.imageableId));
    } catch (error) {
        console.log("ERROR IN POSTING IMAGE", error);
        dispatch(handleError(error));
    }
};

// -------------------DELETE SPOT THUNK---------------
export const deleteSpotThunk = (spotId) => async (dispatch) => {
    try{
        const res = await csrfFetch(`/api/spots/${spotId}`, {
            method: "DELETE",
        })
        if (res.ok) {
            dispatch(deleteSpot(spotId))
        }
    } catch (error) {
       console.error("ERROR DELETING SPOT!!!", error) 
        dispatch(handleError(error))
    }
}

// --------------UPDATE SPOT THUNK--------------
export const updateSpotThunk = (payload, spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (res.ok) {
            const data = await res.json();
            dispatch(updateSpot(data));
            return data;
        }
    } catch (error) {
        console.error("ERROR UPDATING SPOT", error)
        dispatch(handleError(error))
    }
}


// -------------------REDUCER-------------------
// -------------------REDUCER-------------------

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        // -------------------GET SPOTS-------------------
        case GET_SPOTS: {
            const newState = { ...state };
            // console.log("newState:", newState);
            action.payload.forEach((spot) => {
                newState[spot.id] = spot;
            });

            return newState;
        }
        // -------------------DETAILS-------------------
        case GET_SPOT_DETAILS: {
            // console.log("GET_SPOT_DETAILS action.payload:", action.payload);
            const id = action.payload.id;
            return { ...state, [id]: action.payload };
        }
        // -------------------GET CURRENT USER SPOTS-------------------
        case GET_CURRENT_USER_SPOTS: {
            // const newState = structuredClone(state);
            const newState = {};
            action.payload.forEach((spot) => {
                newState[spot.id] = spot;
            });
            // newState[spots]= action.payload;
            return newState;
        }
        // -------------------POST SPOT-------------------
        case POST_SPOT: {
            return { ...state, [action.payload.id]: action.payload };
        }
        // -------------------POST IMG-------------------
        case POST_IMAGE: {
            // res => {id, url, preview}
            const newState = { ...state };
            const spotId = action.spotId;
            const image = action.payload;
            const spot = newState[spotId];

            if (spot) {
                // Check if SpotImages exists, if not, initialize it as an empty array
                if (!spot["SpotImages"]) {
                    spot["SpotImages"] = [];
                }

                spot["SpotImages"].push(image);
            }

            return newState;
        }
        // -------------------DELETE SPOT-------------------
        case DELETE_SPOT: {
            const newState = structuredClone(state);
            delete newState[action.spotId];
            return newState;
        }
        // --------------UPDATE SPOT---------------
        case UPDATE_SPOT: {
            const newState = structuredClone(state);
            newState[action.spot.id] = action.spot;
            return newState;
        }
        // -------------------ERROR-------------------
        case ERROR: {
            return { ...state, error: action.error };
        }
        default:
            return state;
    }
};

export default spotsReducer;
