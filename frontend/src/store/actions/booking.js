import axios from "axios";

import * as actionTypes from "./actionTypes";

let userBookings;

export const fetchStart = () => {
  return {
    type: actionTypes.FETCH_BOOKINGS_START
  };
};

export const getBookingsSuccess = bookings => {
  userBookings = bookings;
  console.log(userBookings);
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

export const fetchBookings = config => {
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
  };
};

export const deleteBookingSuccess = updatedBooking => {
  return {
    type: actionTypes.DELETE_BOOKING_SUCCESS,
    bookings: updatedBooking
  };
};

export const deleteBookingFail = error => {
  return {
    type: actionTypes.DELETE_BOOKING_FAIL,
    error: error
  };
};

export const deleteBooking = (config, bookingId) => {
  return dispatch => {
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
    };

    axios
      .post("http://localhost:8000/graphql", requestBody, config)
      .then(res => {
        const updatedBooking = userBookings.filter(booking => {
          return booking._id !== bookingId;
        });
        dispatch(deleteBookingSuccess(updatedBooking));
      })
      .catch(err => {
        console.log(err);
        dispatch(deleteBookingFail(err));
      });
  };
};
