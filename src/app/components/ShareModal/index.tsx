/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import {
  CloseOutlined,
  ShareAltOutlined,
  CopyOutlined,
  CaretDownFilled,
} from '@ant-design/icons';
import {
  AutoComplete,
  Dropdown,
  Input,
  Menu,
  Tabs,
  Select,
  List,
  Button,
  Checkbox,
} from 'antd';
import Text from 'antd/lib/typography/Text';
import { PERMISSION } from 'app/containers/Dashboard';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { actions, reducer, sliceKey } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'app/selectors';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { shareModalSaga } from './saga';
import { selectShareModal } from './selectors';
import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select;
let timer;

const { TabPane } = Tabs;

interface EmailAndPermission {
  orgId: string;
  toUserId: string;
  toEmail: string;
  permission: string;
  typeId: string;
  type: string;
}

export const ShareModal = ({
  permission,
  onChangePermission,
  linkInvitation,
  closeModal,
  orgId,
  typeId,
  type,
}) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: shareModalSaga });
  // console.log('linkInvitation', linkInvitation);
  const baseClient = `${window.location.protocol}${window.location.hostname}:${window.location.port}/`;

  const [listEmailAndPermission, setListEmailAndPermission] = useState(
    [] as Array<EmailAndPermission>,
  );
  const [textSearch, setTextSearch] = useState('');
  const [message, setMessage] = useState('');
  const [isNoti, setIsNoti] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const { listEmail } = useSelector(selectShareModal);

  const _handleSearch = (value: string) => {
    setTextSearch(value);
    if (!value) {
      dispatch(actions.searchEmailOrNameSuccess([]));
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        dispatch(actions.searchEmailOrNameRequest({ keyword: value, token }));
      }, 1000);
    }
  };

  const _handleSelectEmail = (key, value) => {
    console.log(value, key);
    for (let index = 0; index < listEmailAndPermission.length; index++) {
      const emailAndPermission = listEmailAndPermission[index];
      if (emailAndPermission.toEmail === key) return;
    }
    setListEmailAndPermission([
      ...listEmailAndPermission,
      {
        orgId,
        toUserId: value.key,
        toEmail: value.value,
        permission: PERMISSION.EDITOR,
        typeId,
        type,
      },
    ]);
    // clear text search & list email
    setTextSearch('');
    dispatch(actions.searchEmailOrNameSuccess([]));
  };

  const _sendInvitation = () => {
    dispatch(
      actions.invitationRequest({
        listEmailAndPermission,
        token,
        messageInvite: message,
        isNoti,
      }),
    );
  };

  const _changePermissionPeople = ({ key, index }) => {
    console.log(key, index);
    const listEmailAndPermissionTemp = [...listEmailAndPermission];
    listEmailAndPermissionTemp[index] = {
      ...listEmailAndPermissionTemp[index],
      permission: key,
    };
    setListEmailAndPermission(listEmailAndPermissionTemp);
  };

  const _onchangeMessage = ({ target: { value } }) => {
    setMessage(value);
  };

  const _changeCheckboxNoti = ({ target: { checked } }) => {
    setIsNoti(checked);
  };

  return (
    <Fragment>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 40,
          bottom: 40,
          width: '25rem',
          paddingBottom: '10px',
          backgroundColor: 'white',
          zIndex: 1000,
          paddingLeft: 30,
        }}
        id="share-modal"
      >
        <div
          style={{
            display: 'inline-flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '40px',
            padding: '0 16px 0 0',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <ShareAltOutlined />
            <Text style={{ marginLeft: 6, fontSize: 20, fontWeight: 400 }}>
              Share
            </Text>
          </div>
          <CloseOutlined onClick={closeModal} />
        </div>
        <Tabs
          defaultActiveKey="1"
          className="tab-modal-share"
          style={{ paddingRight: 16 }}
        >
          <TabPane tab="Add People" key="1">
            <AutoComplete
              style={{
                width: '100%',
                borderRadius: 5,
                marginBottom: 10,
                backgroundColor: '#eeeeee',
              }}
              onSearch={_handleSearch}
              value={textSearch}
              placeholder="Write name or email"
              onSelect={_handleSelectEmail}
            >
              {listEmail?.map(item => (
                <Option key={item.id} value={item.email}>
                  {item.email}
                </Option>
              ))}
            </AutoComplete>
            {listEmailAndPermission.length ? (
              <List
                bordered
                dataSource={listEmailAndPermission}
                renderItem={(item, index) => (
                  <List.Item>
                    <Text>{item?.toEmail}</Text>
                    <Dropdown
                      overlay={
                        <Menu
                          onClick={({ key }) =>
                            _changePermissionPeople({ key, index })
                          }
                        >
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
                        <Text>{item.permission}</Text>
                        <CaretDownFilled style={{ padding: 10 }} />
                      </div>
                    </Dropdown>
                  </List.Item>
                )}
              />
            ) : null}

            <Checkbox style={{ marginTop: 20 }} onChange={_changeCheckboxNoti}>
              Notify people
            </Checkbox>
            <TextArea
              style={{
                marginTop: 20,
                backgroundColor: '#eeeeee',
                height: 100,
              }}
              placeholder="Write a message"
              bordered={false}
              value={message}
              onChange={_onchangeMessage}
            />
            <div
              style={{
                width: '100%',
                marginTop: 80,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Button type="primary" onClick={_sendInvitation}>
                Send
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Use Link" key="2">
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
                <CopyOutlined style={{ color: 'gray' }} />
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
          </TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};
