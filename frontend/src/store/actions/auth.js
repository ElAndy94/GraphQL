import axios from "axios";

import * as actionTypes from "./actionTypes";

export const authSuccess = (userId, token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    userId: userId,
    token: token
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  console.log('exp time', expirationTime);
  return dispatch => {
    setTimeout(() => {
      console.log("line 24 logout");
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = requestBody => {
  return dispatch => {
    axios
      .post("http://localhost:8000/graphql", requestBody)
      .then(res => {
        if (res.data.data.login.token) {
          const expirationDate = new Date(
            new Date().getTime() + res.data.data.login.tokenExpiration * 1000
          );
          localStorage.setItem("token", res.data.data.login.token);
          localStorage.setItem("expirationDate", expirationDate);
          localStorage.setItem("userId", res.data.data.login.userId);
          dispatch(
            authSuccess(
              res.data.data.login.userId,
              res.data.data.login.token
            )
          );
          dispatch(checkAuthTimeout(res.data.data.login.tokenExpiration));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};
