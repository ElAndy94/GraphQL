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

export const createEventStart = () => {
  return {
    type: actionTypes.CREATE_EVENT_START
  };
};

export const createEventSuccess = updatedEvents => {
  return {
    type: actionTypes.CREATE_EVENT_SUCCESS,
    events: updatedEvents
  };
};

export const createEventFail = error => {
  return {
    type: actionTypes.CREATE_EVENT_FAIL,
    error: error
  };
};

export const createEvent = (event, config, events, userId) => {
  return dispatch => {
    dispatch(createEventStart());
    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!){
          createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title: event.title,
        desc: event.description,
        price: event.price,
        date: event.date
      }
    };

    axios
      .post("http://localhost:8000/graphql", requestBody, config)
      .then(res => {
        const updatedEvents = [...events];
        updatedEvents.push({
          _id: res.data.data.createEvent._id,
          title: res.data.data.createEvent.title,
          description: res.data.data.createEvent.description,
          date: res.data.data.createEvent.date,
          price: res.data.data.createEvent.price,
          creator: {
            _id: userId
          }
        });
        dispatch(createEventSuccess(updatedEvents));
      })
      .catch(err => {
        console.log(err);
        dispatch(createEventFail(err));
      });
  };
};

export const bookEventStart = () => {
  return {
    type: actionTypes.BOOK_EVENTS_START
  };
};

export const bookEventSuccess = () => {
  return {
    type: actionTypes.BOOK_EVENTS_SUCCESS
    // selectedEvent: selectedEvent
  };
};

export const bookEventFail = error => {
  return {
    type: actionTypes.BOOK_EVENTS_FAIL,
    error: error
  };
};

export const bookEvent = (id, config) => {
  return dispatch => {
    dispatch(bookEventStart());
    const requestBody = {
      query: `
      mutation BookEvent($id: ID!){
        bookEvent(eventId: $id) {
          _id
          createdAt
          updatedAt
        }
      }
    `,
      variables: {
        id: id
      }
    };

    axios
      .post("http://localhost:8000/graphql", requestBody, config)
      .then(res => {
        dispatch(bookEventSuccess());
      })
      .catch(err => {
        console.log(err);
        dispatch(bookEventFail());
      });
  };
};