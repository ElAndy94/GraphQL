import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { connect } from 'react-redux';

import Auth from "./containers/Auth/Auth";
import Events from "./containers/Events/Events";
import Booking from "./containers/Booking/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
import * as actions from './store/actions/index';
import "./App.css";

class App extends Component {
  state = {};

  // handleAuthComplete = () => {
  //   setTimeout(() => {
  //     this.setState({ events: this.props.events });
  //     this.setState({ userId: this.props.userId, token: this.props.token });
  //   }, 500);
  // };

  // logout = () => {
  //   this.setState({ token: null, userId: null });
  // };

  componentDidMount() {
    this.props.onTryAutoSingup();
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
              <Switch>
                {this.props.isAuthenticated && <Redirect from="/" to="/events" exact />}
                {this.props.isAuthenticated && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                {!this.props.isAuthenticated && <Route path="/auth" component={Auth} />}
                <Route path="/events" component={Events} />
                {this.props.isAuthenticated && (
                  <Route path="/bookings" component={Booking} />
                )}
                {!this.props.isAuthenticated && <Redirect to="/auth" exact />}
              </Switch>
            </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

// const mapStateToProps = state => ({
//   userId: state.auth.userId,
//   token: state.auth.token,
//   tokenExpiration: state.auth.tokenExpiration,
// });

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSingup: () => dispatch(actions.authCheckState())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
