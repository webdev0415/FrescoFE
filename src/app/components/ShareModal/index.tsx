import React, { Fragment, useCallback, useState } from 'react';
import { CaretDownFilled } from '@ant-design/icons';
import { Checkbox, Dropdown, Menu } from 'antd';
import Text from 'antd/lib/typography/Text';
import { PERMISSION } from 'app/containers/Dashboard';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { CloseIcon, CopyIcon, PencilIcon, ShareIcon } from 'assets/icons';
import clsx from 'clsx';

declare type Tabs = 'add-people' | 'use-link';

export const ShareModal = ({
  permission,
  onChangePermission,
  linkInvitation,
  closeModal,
}) => {
  // console.log('linkInvitation', linkInvitation);
  const [tab, setTab] = useState<Tabs>('add-people');
  const handleChangeTab = useCallback(
    (value: Tabs) => {
      if (value !== tab) {
        setTab(value);
      }
    },
    [tab],
  );
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
            <div
              className={clsx('share-modal-tab', {
                active: tab === 'add-people',
              })}
              onClick={() => handleChangeTab('add-people')}
            >
              Add People
            </div>
            <div
              className={clsx('share-modal-tab', {
                active: tab === 'use-link',
              })}
              onClick={() => handleChangeTab('use-link')}
            >
              Use Link
            </div>
          </div>
          <div className="share-modal-tab-content">
            {tab === 'add-people' && (
              <>
                <div className="input-group my-1">
                  <input type="text" placeholder="Write name or email" />
                  <Dropdown
                    className="btn"
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
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <PencilIcon />
                      <CaretDownFilled />
                    </div>
                  </Dropdown>
                </div>
                <div className="divider" />
                <div className="input-group my-1">
                  <div className="profile-section">
                    <div className="profile-image">
                      <div className="oval">J</div>
                    </div>
                    <div className="profile-content">
                      <div className="profile-title">Jose</div>
                      <div className="profile-email">jose@questionpro.com</div>
                    </div>
                  </div>
                  <Dropdown
                    className="btn"
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
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <PencilIcon />
                      <CaretDownFilled />
                    </div>
                  </Dropdown>
                </div>
                <Checkbox>Notify people</Checkbox>
                <textarea
                  className="message-input"
                  placeholder="Write a message"
                />
                <div className="share-modal-tab-content-footer">
                  <div className="divider" style={{ marginBottom: '16px' }} />
                  <div className="share-modal-footer-actions">
                    <div className="action-button">Send</div>
                  </div>
                </div>
              </>
            )}
            {tab === 'use-link' && (
              <>
                <div className="input-group-action my-1">
                  <input
                    type="text"
                    disabled
                    value={`${window.location.origin}/invitation-type/verification/${linkInvitation.token}`}
                  />
                  <div className="btn">
                    <CopyToClipboard
                      text={`${window.location.origin}/invitation-type/verification/${linkInvitation.token}`}
                    >
                      <CopyIcon />
                    </CopyToClipboard>
                  </div>
                </div>
                <div className="inline-dropdown">
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
                    <div
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <Text>Anyone with the</Text>
                      <CaretDownFilled style={{ padding: 10 }} />
                    </div>
                  </Dropdown>
                  <span>can</span>
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
                    <div
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <PencilIcon />
                      <CaretDownFilled style={{ padding: 10 }} />
                    </div>
                  </Dropdown>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
