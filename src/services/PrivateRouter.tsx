import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const authInfo = localStorage.getItem('authInformation');
  return (
    <Route
      {...rest}
      render={props =>
        authInfo ? <Component {...props} /> : <Redirect to="/auth/login" />
      }
    />
  );
};
