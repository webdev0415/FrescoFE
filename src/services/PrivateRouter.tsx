import React from 'react';
import { Route, Redirect } from 'react-router-dom';

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
