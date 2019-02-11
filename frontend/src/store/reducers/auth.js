import * as actionTypes from "../actions/actionTypes";

const initialState = {
  isLoggedIn: false,
  token: null,
  userId: null,
  // loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userId: action.userId,
        token: action.token
        // loading: false
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        isLoggedIn: true,
        userId: null,
        token: null,
        tokenExpiration: null
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state
      };
    default:
      return state;
  }
};

export default reducer;
