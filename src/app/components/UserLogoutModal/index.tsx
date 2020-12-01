import React, { Fragment } from 'react';
import { LogoutOutlined } from '@ant-design/icons';

export const UserLogoutModal = ({ logOut }) => {
  const handleLogOut = () => {
    logOut();
  };

  return (
    <Fragment>
      <div className="backdrop" />
      <div
        className="user-modal-container"
        id="account-modal"
        style={{
          top: '40px',
        }}
      >
        <div className="profile-nav-section">
          <div className="nav-link logout-nav" onClick={() => handleLogOut()}>
            <LogoutOutlined />
            <span>Log Out</span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
