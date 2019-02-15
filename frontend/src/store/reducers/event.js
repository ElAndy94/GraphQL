import * as actionTypes from "../actions/actionTypes";
// import { updateObject } from "../../shared/utility";

const initialState = {
  events: [],
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
        events: action.events,
        loading: false
      };
    case actionTypes.FETCH_EVENTS_FAIL:
      return {
        ...state,
        loading: false
      };
    case actionTypes.CREATE_EVENT_START:
      return {
        ...state,
        loading: true
      };
    case actionTypes.CREATE_EVENT_SUCCESS:
      return {
        ...state,
        events: action.events,
        loading: false
      };
    case actionTypes.CREATE_EVENT_FAIL:
      return {
        ...state,
        loading: false
      };
    case actionTypes.BOOK_EVENTS_START:
      return {
        ...state,
        loading: true
      };
    case actionTypes.BOOK_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case actionTypes.BOOK_EVENTS_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;

//** Two different ways to do this, this is a cleaner way but for learning purpose I will be using the one above. */

// const fetchEventsStart = (state, action) => {
//   return updateObject(state, {loading: true});
// };

// const fetchEventsSuccess = (state, action) => {
//   return updateObject(state, {
//       events: action.events,
//       loading: false
//   });
// };

// const fetchEventsFail = (state, action) => {
//   return updateObject(state, {
//       error: action.error,
//       loading: false
//   });
// };

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//       case actionTypes.FETCH_EVENTS_START: return fetchEventsStart(state, action);
//       case actionTypes.FETCH_EVENTS_SUCCESS: return fetchEventsSuccess(state, action);
//       case actionTypes.FETCH_EVENTS_FAIL: return fetchEventsFail(state, action);
//       default:
//           return state;
//   }
// };
