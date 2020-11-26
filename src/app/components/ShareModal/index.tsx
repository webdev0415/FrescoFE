import React, { Fragment, useEffect } from 'react';
import {
  CloseOutlined,
  ShareAltOutlined,
  CopyOutlined,
  CaretDownFilled,
} from '@ant-design/icons';
import { AutoComplete, Dropdown, Input, Menu, Tabs } from 'antd';
import Text from 'antd/lib/typography/Text';
import { PERMISSION } from 'app/containers/Dashboard';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { actions, reducer, sliceKey } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'app/selectors';
let timer;

const { TabPane } = Tabs;

export const ShareModal = ({
  permission,
  onChangePermission,
  linkInvitation,
  closeModal,
}) => {
  // console.log('linkInvitation', linkInvitation);
  const baseClient = `${window.location.protocol}${window.location.hostname}:${window.location.port}/`;

  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  useEffect(() => {
    dispatch(actions.searchEmailRequest({ keyword: '123', token }));
  }, [dispatch, token]);

  // const _handleSearch = (value: string) => {
  //   if (timer) {
  //     clearTimeout(timer);
  //   }
  //   timer = setTimeout(() => {
  //     dispatch(
  //       actions.searchEmailRequest({ data: { email: value, orgId }, token }),
  //     );
  //   }, 1000);
  // };

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
        <Tabs defaultActiveKey="1" style={{ paddingRight: 16 }}>
          <TabPane tab="Add People" key="1">
            Add People
            {/* <AutoComplete
              style={{ width: '100%', borderRadius: 5, marginBottom: 10 }}
              onSearch={_handleSearch}
              placeholder="Search email"
              onSelect={value => handleSelectEmail(value)}
              onChange={value => handleSelectEmail(value)}
            >
              {listEmail?.map(item => (
                <Option key={item.id} value={item.email}>
                  {email.email}
                </Option>
              ))}
            </AutoComplete> */}
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
