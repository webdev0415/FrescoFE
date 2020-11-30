import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../selectors';
import {
  CopyOutlined,
  GlobalOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

export const UserModal = ({ logOut, showInvite, organization }) => {
  const user = useSelector(selectUser);

  const handleLogOut = () => {
    logOut();
  };

  const handleInvite = () => {
    showInvite();
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
            <div className="profile-title">
              {organization.fName} {organization.lName}
            </div>
            <div className="profile-email">{user?.email}</div>
            <button type="button" className="profile-setting-button">
              Settings
            </button>
          </div>
        </div>
        <div className="divider" />
        <div className="profile-nav-section">
          <div className="nav-link">
            <GlobalOutlined />
            <span>My Organization</span>
          </div>
          <div className="nav-link" onClick={() => handleInvite()}>
            <UserAddOutlined />
            <span>Invite people</span>
          </div>
          <div className="user-invitation-link-input">
            <input readOnly type="text" value="www.fresco.com/QuestionPro" />
            <div className="copy-button">
              <CopyOutlined />
            </div>
          </div>
          <div className="nav-link logout-nav" onClick={() => handleLogOut()}>
            <LogoutOutlined />
            <span>Log Out</span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
