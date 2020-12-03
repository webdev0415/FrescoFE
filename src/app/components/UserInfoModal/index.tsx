import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../selectors';
import { LogoutOutlined } from '@ant-design/icons';

export const UserInfoModal = ({ logOut }) => {
  const user = useSelector(selectUser);

  const handleLogOut = () => {
    logOut();
  };

  return (
    <Fragment>
      <div className="backdrop" />
      <div className="user-modal-container" id="account-modal">
        <div className="user-profile-section">
          <div className="profile-image">
            <img
              src={require('../../../assets/images/avatar-default.png')}
              alt=""
            />
          </div>
          <div className="profile-content">
            <div className="profile-email">{user?.email}</div>
            <button type="button" className="profile-setting-button">
              Settings
            </button>
          </div>
        </div>
        <div className="divider" />
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
