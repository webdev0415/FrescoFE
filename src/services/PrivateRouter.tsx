import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthLayout from 'app/layouts/AuthLayout';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const authInfo = localStorage.getItem('authInformation');
  return (
    <Route
      {...rest}
      render={props =>
        authInfo ? (
          <AuthLayout>
            <Component {...props} />
          </AuthLayout>
        ) : (
          <Redirect to="/auth/login" />
        )
      }
    />
  );
};
