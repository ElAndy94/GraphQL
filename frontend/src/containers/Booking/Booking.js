import React, { Component } from "react";
import { connect } from "react-redux";

import Spinner from "../../components/Spinner/Spinner";
import BookingList from "../../components/Bookings/BookingList/BookingList";
import BookingsChart from "../../components/Bookings/BookingsChart/BookingsChart";
import BookingControls from "../../components/Bookings/BookingControls/BookingControls";
import * as actions from "../../store/actions/index";

class Booking extends Component {
  state = {
    outputType: "list"
  };

  componentDidMount() {
    const token = this.props.token;
    const config = { headers: { Authorization: "bearer " + token } };
    this.props.onfetchBookings(config);
  }

  deleteBookingHandler = bookingId => {
    // this.setState({ isLoading: true });
    const token = this.props.token;
    const config = { headers: { Authorization: "bearer " + token } };
    this.props.onDeleteBooking(config, bookingId);
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
    if (!this.props.isLoading) {
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
    bookings: state.booking.bookings,
    isLoading: state.booking.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onfetchBookings: config => dispatch(actions.fetchBookings(config)),
    onDeleteBooking: (config, bookingId) => dispatch(actions.deleteBooking(config, bookingId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Booking);
