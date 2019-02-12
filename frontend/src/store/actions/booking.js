import axios from "axios";

import * as actionTypes from "./actionTypes";

export const fetchStart = () => {
  return {
    type: actionTypes.FETCH_BOOKINGS_START
  };
};

export const getBookingsSuccess = bookings => {
  return {
    type: actionTypes.FETCH_BOOKINGS_SUCCESS,
    bookings: bookings
  };
};

export const fetchBookingsFail = error => {
  return {
    type: actionTypes.FETCH_BOOKINGS_FAIL,
    error: error
  };
};

export const fetchBookings = (config) => {
  return dispatch => {
    dispatch(fetchStart());
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `
    };

    axios
      .post("http://localhost:8000/graphql", requestBody, config)
      .then(res => {
        const bookings = res.data.data.bookings;
        dispatch(getBookingsSuccess(bookings));
      })
      .catch(err => {
        console.log(err);
        dispatch(fetchBookingsFail(err));
      });
  }
};

export const deleteBooking = () => {

};