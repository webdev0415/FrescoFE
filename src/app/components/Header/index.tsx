import React from 'react';
import logoImg from 'assets/icons/logo.svg';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isLogIn?: boolean;
}

const Header: React.FC<HeaderProps> = props => {
  return (
    <div
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '40px',
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
        <Link
          to="/"
          style={{
            textAlign: 'left',
            color: 'white',
          }}
        >
          <img src={logoImg} alt="logo" />
        </Link>
        {props.isLogIn && (
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#9646F5',
              borderRadius: '50%',
              fontSize: '12px',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
            id="profile-icon"
          >
            AB
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
