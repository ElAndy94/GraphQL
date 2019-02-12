import * as actionTypes from "../actions/actionTypes";

const initialState = {
  bookings: [],
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BOOKINGS_START:
      return {
        ...state,
        loading: true
      };
    case actionTypes.FETCH_BOOKINGS_SUCCESS:
      return {
        ...state,
        bookings: action.bookings,
        loading: false
      };
    case actionTypes.FETCH_BOOKINGS_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;