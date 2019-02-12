import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import Spinner from "../../components/Spinner/Spinner";
import BookingList from "../../components/Bookings/BookingList/BookingList";
import BookingsChart from "../../components/Bookings/BookingsChart/BookingsChart";
import BookingControls from "../../components/Bookings/BookingControls/BookingControls";
import * as actions from "../../store/actions/index";

class Booking extends Component {
  state = {
    isLoading: false,
    // bookings: [],
    outputType: "list"
  };

  componentDidMount() {
    const token = this.props.token;
    const config = { headers: { Authorization: "bearer " + token } };
    this.props.onfetchBookings(config);
    // this.fetchBookings();
  }

  // fetchBookings = () => {};

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
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

    const token = this.props.token;
    const config = { headers: { Authorization: "bearer " + token } };

    axios
      .post("http://localhost:8000/graphql", requestBody, config)
      .then(res => {
        this.setState(prevState => {
          const updatedBooking = prevState.bookings.filter(booking => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBooking, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  changeOutputTypeHandler = outputType => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingControls
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputTypeHandler}
          />
          <div>
            {this.state.outputType === "list" ? (
              <BookingList
                bookings={this.props.bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingsChart bookings={this.props.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    bookings: state.booking.bookings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onfetchBookings: config => dispatch(actions.fetchBookings(config)),
    onDeleteBooking: () => dispatch(actions.deleteBooking())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Booking);
