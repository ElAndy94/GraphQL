import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";
import "./MainNavigation.css";

const mainNavigation = props => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>EasyEvent</h1>
    </div>
    <nav className="main-navigation__items">
      <ul>
        {!props.isAuthenticated && (
          <li>
            <NavLink to="/auth">Login</NavLink>
          </li>
        )}
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        {props.isAuthenticated && (
          <React.Fragment>
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
            <li>
              <button onClick={props.onLogout}>Logout</button>
            </li>
          </React.Fragment>
        )}
      </ul>
    </nav>
  </header>
);

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mainNavigation);
