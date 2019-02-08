import * as actionTypes from "../actions/actionTypes";

const initialState = {
  isLoggedIn: false,
  token: null,
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EVENTS_START:
      return {
        ...state,
        loading: true
      };
    case actionTypes.FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.token,
        loading: false
      };
    case actionTypes.FETCH_EVENTS_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;