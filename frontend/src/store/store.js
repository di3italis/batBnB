import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';

const rootReducer = combineReducers({

})


const configureStore = async (preloadedState) => {
  let enhancer;

  if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
  } else {
    const reduxLogger = await import('redux-logger');
    const logger = reduxLogger.default;
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
  }

  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
