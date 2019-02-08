import axios from "axios";

import * as actionTypes from "./actionTypes";

export const fetchStart = () => {
  return {
    type: actionTypes.FETCH_EVENTS_START
  };
};

export const fetchEventsSuccess = updatedEvents => {
  return {
    type: actionTypes.FETCH_EVENTS_SUCCESS,
    events: updatedEvents
  };
};

export const fetchEventsFail = error => {
  return {
    type: actionTypes.FETCH_EVENTS_FAIL,
    error: error
  };
};

export const fetchEvents = () => {
  return dispatch => {
    dispatch(fetchStart());
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    axios
      .post("http://localhost:8000/graphql", requestBody)
      .then(res => {
        const events = res.data.data.events;
        dispatch(fetchEventsSuccess(events));
      })
      .catch(err => {
        console.log(err);
        dispatch(fetchEventsFail(err));
      });
  };
};

// export const fetchEvents = () => dispatch => {
//   console.log('hello');
//   dispatch({
//     type: actionTypes.FETCH_EVENTS,
//     payload: events
//   });
// };

// export const createItem = itemData => dispatch => {
//   const randomId = Math.floor(Math.random() * 1000);
//   itemData.id = randomId;
//   dispatch({
//     type: actionTypes.NEW_ITEM,
//     payload: itemData
//   });
// };

// export const deleteItem = (id, prevFiltered) => dispatch => {
//   if (prevFiltered) {
//     filteredItems = filteredItems.filter(item => item.id !== id);
//     dispatch({
//       type: actionTypes.DELETE_ITEM,
//       payload: filteredItems
//     });
//   } else {
//     filteredItems = list.filter(item => item.id !== id);
//     dispatch({
//       type: actionTypes.DELETE_ITEM,
//       payload: filteredItems
//     });
//   }
// };

// export const editItem = (data, prevFiltered) => dispatch => {
//   if (prevFiltered) {
//     filteredItems = filteredItems.map(item => {
//       if (item.id === data.id) {
//         item.body = data.body;
//       }
//       return item;
//     });
//     dispatch({
//       type: actionTypes.EDIT_ITEM,
//       payload: filteredItems
//     });
//   } else {
//     filteredItems = list.map(item => {
//       if (item.id === data.id) {
//         item.body = data.body;
//       }
//       return item;
//     });
//     dispatch({
//       type: actionTypes.EDIT_ITEM,
//       payload: filteredItems
//     });
//   }
// };
