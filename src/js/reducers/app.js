import baseReducer from './base';
// import { app as appActions } from '../actions';

// const {

// } = appActions;

export const defaultState = {

};

const reducer = (
  state,
  action,
) => {
  const { type } = action;
  // Call the supplied function and pass in state and action
  // const reduce = reduceFunction => reduceFunction(state, action);

  switch (type) {
    default: return state;
  }
};

export default baseReducer(defaultState, reducer);
