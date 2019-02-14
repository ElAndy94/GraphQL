import React, { Component } from "react";
import axios from "axios";
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import * as actions from '../../store/actions/index';
import Modal from "../../components/Modal/Modal";
import Backdrop from "../../components/Backdrop/Backdrop";
import EventList from "../../components/Events/EventList/EventList";
import Spinner from "../../components/Spinner/Spinner";
import "./Events.css";

class Events extends Component {
  state = {
    creating: false,
    selectedEvent: null
  };
  isActive = true;

  constructor(props) {
    super(props);

    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }
  
  componentDidMount() {
    this.props.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    // ^ same   const event = {title: title, price: price, date: date, description: description};

    const token = this.props.token;
    const config = { headers: { Authorization: "bearer " + token } };

    this.props.createEvent(event, config, this.props.events, this.props.userId);
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  showDetailHandler = eventId => {
      const selectedEvent = this.props.events.find(e => e._id === eventId);
      this.setState({ selectedEvent: selectedEvent });
  };

  bookEventHandler = () => {
    if (!this.props.isAuthenticated) {
      this.setState({ selectedEvent: null });
      return;
    }
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
        id: this.state.selectedEvent._id
      }
    };

    const token = this.props.token;
    const config = { headers: { Authorization: "bearer " + token } };

    axios
      .post("http://localhost:8000/graphql", requestBody, config)
      .then(res => {
        console.log(res.data);
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // componentWillUnmount() {
  //   this.isActive = false;
  // }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.props.isAuthenticated ? "Book" : "Confirm"}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              £{this.state.selectedEvent.price} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.props.isAuthenticated && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.props.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.props.events}
            authUserId={this.props.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
  events: state.events.events,
  userId: state.auth.userId,
  token: state.auth.token,
  isLoading: state.events.loading
});

const mapDispatchToProps = dispatch => {
  return {
    fetchEvents: () => dispatch( actions.fetchEvents() ),
    createEvent: (event, config, events, userId) => dispatch( actions.createEvent(event, config, events, userId) )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
