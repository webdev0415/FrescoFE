/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { useInjectReducer } from 'utils/redux-injectors';
import { GlobalStyle } from 'styles/global-styles';
import { Layout, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import { reducer, sliceKey } from './slice';
import { Dashboard } from './containers/Dashboard/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { Signup } from './containers/Signup/Loadable';
import { SignIn } from './containers/SignIn/Loadable';
import { EmailConfirmation } from './containers/EmailConfirmation';
import { CheckEmailView } from './containers/CheckEmailView/Loadable';
import { WelcomePage } from './containers/WelcomePage';
import { SelectOrganizationPage } from './containers/SelectOrganizationPage';
import { SelectBoard } from './containers/SelectBoard';
import { actions } from './slice';
import Auth from '../services/Auth';

// Containers
import { ListOrganizations } from './containers/ListOrganizations';
import { VerifyInvitation } from './containers/VerifyInvitation';

// Services
import { PrivateRoute } from '../services/PrivateRouter';
import { SignupForInvitation } from './containers/SignupForInvitation/Loadable';
import { CreateCanvas } from './containers/CreateCanvas';
import logoImg from 'assets/icons/logo.svg';
import { GuestRoute } from 'services/GuestRoute';

function AppComponent(props) {
  useInjectReducer({ key: sliceKey, reducer });
  const { Header, Content, Footer } = Layout;
  const { Title } = Typography;

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('authInformation')) {
      const authInfo = JSON.parse(
        localStorage.getItem('authInformation') || '',
      );
      if (authInfo) {
        dispatch(actions.setAuthInformation(authInfo));
      }
    }
  }, [dispatch]);

  return (
    <>
      <Helmet titleTemplate="Fresco" defaultTitle="Fresco">
        <meta name="Fresco" content="Fresco" />
      </Helmet>

      <Switch>
        <GuestRoute exact path="/auth/login" component={SignIn} />
        <GuestRoute exact path="/auth/register" component={Signup} />
        <GuestRoute
          exact
          path="/auth/register-for-invitation"
          component={SignupForInvitation}
        />
        <GuestRoute
          exact
          path="/auth/email-confirmation/:code"
          component={EmailConfirmation}
        />
        <GuestRoute exact path="/auth/check-email" component={CheckEmailView} />
        <GuestRoute exact path="/auth/welcome-page" component={WelcomePage} />

        <PrivateRoute exact path="/organization/:id" component={Dashboard} />
        <PrivateRoute exact path="/board" component={SelectBoard} />
        <PrivateRoute exact path="/create-canvas" component={CreateCanvas} />
        <PrivateRoute exact path="/" component={ListOrganizations} />
        <Route exact path="/invite/:token" component={VerifyInvitation} />
        <PrivateRoute
          exact
          path="/create-org"
          component={SelectOrganizationPage}
        />
        <PrivateRoute component={NotFoundPage} />
        <GuestRoute component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
      <Footer style={{ textAlign: 'center' }}>
        © 2020 Fresco | +1 (800) 123 4567
      </Footer>
    </>
  );
}

const App = withRouter(AppComponent);
export { App };
