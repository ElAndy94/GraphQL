import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Auth from './containers/Auth';
import Events from './containers/Events';
import Booking from './containers/Booking';
import MainNavigation from './components/Navigation/MainNavigation';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact />
              <Route path="/auth" component={Auth} />
              <Route path="/events" component={Events} />
              <Route path="/bookings" component={Booking} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
