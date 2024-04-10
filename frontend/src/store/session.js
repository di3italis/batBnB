// Import a custom fetch utility to handle CSRF protection
import { csrfFetch } from './csrf';

// Action type constants
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// Action creator for setting the current user in the Redux state
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

// Action creator for removing the current user from the Redux state
const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

// THUNKS
// Thunk action for logging in a user
export const login = (user) => async (dispatch) => {
  // Destructuring to get credentials from the user object
  const { credential, password } = user;
  // Making a POST request to the server's login endpoint
  const res = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await res.json();
  // Dispatching setUser action with the logged-in user data
  dispatch(setUser(data.user));
  return res;
};

// Thunk action for restoring a user session
export const restoreUser = () => async (dispatch) => {
  // Making a GET request to check the current session user
  const res = await csrfFetch('/api/session');
  const data = await res.json();
  // Dispatching setUser action if a session user exists
  dispatch(setUser(data.user));
  return res;
};

// Thunk action for signing up a new user
export const signup = (user) => async (dispatch) => {
  // Destructuring to get user details from the signup form
  const { username, firstName, lastName, email, password } = user;
  // Making a POST request to the server's signup endpoint
  const res = await csrfFetch('/api/users', {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  const data = await res.json();
  // Dispatching setUser action with the new user's data
  dispatch(setUser(data.user));
  return res;
};

// Thunk action for logging out a user
export const logout = () => async (dispatch) => {
  // Making a DELETE request to the server's logout endpoint
  const res = await csrfFetch('/api/session', {
    method: "DELETE"
  });
  // Dispatching removeUser action to clear the user from the state
  if (res.ok) {
  dispatch(removeUser());
  return res;
  }
};

// Initial state for the session, defaulting to no user logged in
const initialState = { user: null };

// Reducer function for handling session-related actions
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      // Setting the session user to the payload's user
      return { ...state, user: action.payload };
    case REMOVE_USER:
      // Removing the session user, setting back to null
      return { ...state, user: null };
    default:
      // Returning the current state for any unhandled actions
      return state;
  }
};

// Exporting the session reducer as the default export
export default sessionReducer;
