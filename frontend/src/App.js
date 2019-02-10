import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { connect } from 'react-redux';

import Auth from "./containers/Auth/Auth";
import Events from "./containers/Events/Events";
import Booking from "./containers/Booking/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
// import AuthContext from "./context/auth-context";
import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  handleAuthComplete = () => {
    // console.log('hello' , this.props.userId, this.props.token);
    this.setState({ userId: this.props.userId, token: this.props.token });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          {/* <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          > */}
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}

              {!this.state.token && (
                <Route
                  path="/auth"
                  render={props => (
                    <Auth {...props} onAuthComplete={this.handleAuthComplete} />
                  )}
                />
              )}
              {!this.state.token && (
                <Redirect from="/events" to="/events" exact />
              )}
              {this.state.token &&
                (<Route path="/events" component={Events} />,
                <Route path="/bookings" component={Booking} />)}
              {!this.state.token && (
                <Route
                  path="/auth"
                  render={props => (
                    <Auth {...props} onAuthComplete={this.handleAuthComplete} />
                  )}
                />
              )}
            </Switch>
          </main>
          {/* </AuthContext.Provider> */}
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.userId,
  token: state.auth.token,
  tokenExpiration: state.auth.tokenExpiration,
});

export default connect(mapStateToProps, null)(App);
