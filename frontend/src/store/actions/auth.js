import axios from "axios";

import * as actionTypes from "./actionTypes";

export const authSuccess = (userId, token, tokenExpiration) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    userId: userId,
    token: token,
    tokenExpiration: tokenExpiration
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const auth = requestBody => {
  return dispatch => {
    axios
      .post("http://localhost:8000/graphql", requestBody)
      .then(res => {
        if (res.data.data.login.token) {
          dispatch(
            authSuccess(
              res.data.data.login.userId,
              res.data.data.login.token,
              res.data.data.login.tokenExpiration
            )
          );
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(authFail(err));
      });
  };
};
