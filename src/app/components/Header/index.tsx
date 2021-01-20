import React from 'react';
import logoImg from '../../../assets/icons/logo.svg';
import { useHistory } from 'react-router-dom';
import './Header.less';
import { useSelector } from 'react-redux';
import { selectUser } from '../../selectors';
import Avatar from '../Avatar';

interface HeaderProps {
  isLogIn?: boolean;
}
/* istanbul ignore next */
const Header: React.FC<HeaderProps> = props => {
  const user = useSelector(selectUser);
  const history = useHistory();
  const currentUrl = history.location.pathname;
  let headerButton;
  if (currentUrl == '/auth/login') {
    headerButton = (
      <button
        onClick={() => {
          history.push('/auth/register');
        }}
        className="top-login-button"
      >
        Create Account
      </button>
    );
  } else if (currentUrl == '/auth/register') {
    headerButton = (
      <div>
        <span className="top-have-account">Already have an account? </span>
        <button
          onClick={() => {
            history.push('/auth/login');
          }}
          className="top-login-button"
        >
          Log In
        </button>
      </div>
    );
  }

  const userFullName =
    user && user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : null;

  return (
    <div
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '56px',
        backgroundColor: '#5D2E8C',
        padding: '0 16px',
        zIndex: 100,
      }}
    >
      <div
        className="logo"
        style={{
          display: 'inline-flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <a
          style={{
            textAlign: 'left',
            color: 'white',
          }}
          href="/"
        >
          <img src={logoImg} alt="logo" />
        </a>
        <div>{headerButton}</div>
        {props.isLogIn && (
          <Avatar fullName={userFullName} avatar={user?.avatar} />
        )}
      </div>
    </div>
  );
};

export default Header;
