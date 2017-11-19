import { createStore, applyMiddleware, compose } from 'redux';
import persistState from 'redux-localstorage';
import rootReducer from '../reducers';

const setUpStore = (additionalMiddleware) => {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middleware = [
    ...additionalMiddleware,
  ];

  return (initialState) => {
    const store = createStore(
      rootReducer,
      initialState,
      composeEnhancers(
        applyMiddleware(...middleware),
        persistState(),
      ),
    );

    return store;
  };
};

export default setUpStore;
