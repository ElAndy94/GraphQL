import React, { Component } from "react";
import axios from "axios";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import "./Events.css";

class Events extends Component {
  state = {
    creating: false,
    events: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
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
    console.log(event);

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
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

    const token = this.context.token;

    const config = { headers: { Authorization: "bearer " + token } };

    axios
      .post("http://localhost:8000/graphql", requestBody, config)
      .then(res => {
        // console.log(res.data.data);
        this.fetchEvents();
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchEvents() {
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
        this.setState({events: events});
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const eventList = this.state.events.map(event => {
      return <li key={event._id} className="events__list-item">{event.title}</li>;
    });

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
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
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">
          {eventList}
        </ul>
      </React.Fragment>
    );
  }
}

export default Events;
