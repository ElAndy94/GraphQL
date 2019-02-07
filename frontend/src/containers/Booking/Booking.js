import React, { Component } from 'react';
import axios from 'axios';

import AuthContext from '../../context/auth-context';
import Spinner from '../../components/Spinner/Spinner';

class Booking extends Component {
  state = {
    isLoading: false,
    bookings: []
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
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
            }
          }
        }
      `
    };

    const token = this.context.token;
    const config = { headers: { Authorization: "bearer " + token } };

    axios
      .post("http://localhost:8000/graphql", requestBody, config)
      .then(res => {
        const bookings = res.data.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <React.Fragment>
      {this.state.isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {this.state.bookings.map(booking => (
            <li key={booking._id}>
              {booking.event.title} -{' '}
              {new Date(booking.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
    );
  }
}

export default Booking;