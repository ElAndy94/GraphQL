import * as actionTypes from "../actions/actionTypes";

const initialState = {
  isLoggedIn: false,
  token: null,
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.token,
        loading: false
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;