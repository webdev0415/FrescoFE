import React, { Fragment } from 'react';
import { CaretDownFilled, CopyOutlined } from '@ant-design/icons';
import { Dropdown, Input, Menu, Tabs } from 'antd';
import Text from 'antd/lib/typography/Text';
import { PERMISSION } from 'app/containers/Dashboard';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { CloseIcon, ShareIcon, CopyIcon } from 'assets/icons';

const { TabPane } = Tabs;

export const ShareModal = ({
  permission,
  onChangePermission,
  linkInvitation,
  closeModal,
}) => {
  // console.log('linkInvitation', linkInvitation);
  const baseClient = `${window.location.protocol}${window.location.hostname}:${window.location.port}/`;
  return (
    <Fragment>
      <div className="share-modal-container">
        <div className="share-modal-header">
          <div className="share-modal-title">
            <ShareIcon />
            <span>Share</span>
          </div>
          <div className="share-modal-close-icon">
            <CloseIcon onClick={closeModal} />
          </div>
        </div>
        <div className="share-modal-content">
          <div className="share-modal-tabs">
            <div className="share-modal-tab">Add People</div>
            <div className="share-modal-tab">Use Link</div>
          </div>
          <div className="share-modal-tab-content">
            <div
              style={{
                display: 'inline-flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                width: '100%',
                paddingRight: 6,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <Input
                bordered={false}
                disabled
                value={`${baseClient}invitation-type/verification/${linkInvitation.token}`}
              />
              <CopyToClipboard
                text={`${baseClient}invitation-type/verification/${linkInvitation.token}`}
              >
                <CopyIcon style={{ color: 'gray' }} />
              </CopyToClipboard>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Dropdown
                overlay={
                  <Menu onClick={onChangePermission}>
                    <Menu.Item key={PERMISSION.EDITOR}>
                      <Text>{PERMISSION.EDITOR}</Text>
                    </Menu.Item>
                    <Menu.Item key={PERMISSION.VIEW}>
                      <Text>{PERMISSION.VIEW}</Text>
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Text>Anyone with the link have permission {permission}</Text>
                  <CaretDownFilled style={{ padding: 10 }} />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
