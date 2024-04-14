import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk }  from 'redux-thunk';
import sessionReducer from './session'
import spotsReducer from './spots';

const rootReducer = combineReducers({
	session: sessionReducer,
  spots: spotsReducer
})

const configureStore = async (preloadedState) => { // took out async 240406
  let enhancer;

  if (import.meta.env.MODE === 'production') {
  // if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
  } else {
    const logger = (await import("redux-logger")).default
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
  }

  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
