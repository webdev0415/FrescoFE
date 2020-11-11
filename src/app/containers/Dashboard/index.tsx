/**
 *
 * Dashboard
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { Button, Card, Col, Row, Tabs, Input, Select } from 'antd';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { Redirect, useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectDashboard } from './selectors';
import { selectToken } from '../../selectors';
import { dashboardSaga } from './saga';
import { actions as globalActions } from '../../slice';
import dashboardIcon from 'assets/icons/dashboard.svg';
import pageIcon from 'assets/icons/page.svg';

// Components
import { UserModal } from '../../components/UserModal';
import { InviteMemberModal } from '../../components/InviteMemberModal';
import Axios from 'axios';

import './styles.less';
import { BoardList } from '../BoardList';

const { TabPane } = Tabs;
export const PERMISSION = {
  // ADMIN: 'admin',
  EDITOR: 'editor',
  VIEW: 'view',
};

interface Props {
  match?: any;
}

export const Dashboard = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardSaga });
  const [organization, setOrganization] = useState<any>(null);
  const [isShowUserModal, setIsShowUserModal] = useState(false);
  const [isShowAddNewCanvas, setIsShowAddNewCanvas] = useState(false);
  const [isShowInvitationModal, setIsShowInvitationModal] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState(PERMISSION.EDITOR);

  const orgId = props?.match?.params?.id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dashboard = useSelector(selectDashboard);
  // console.log('dashboard', dashboard);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const history = useHistory();

  const token = useSelector(selectToken);
  // const user = useSelector(selectUser);

  useEffect(() => {
    Axios.request({
      method: 'GET',
      url: process.env.REACT_APP_BASE_URL + 'organization/' + orgId,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setOrganization(response.data);
        console.log('response.data', response.data);
      })
      .catch(error => {
        console.error(error.response);
      });
  }, [orgId, token]);

  const handleSearch = (value: string) => {
    dispatch(
      actions.searchEmailRequest({ data: { email: value, orgId }, token }),
    );
  };

  const _handleSelectEmail = value => {
    setEmail(value);
  };

  const _handleChangePermission = value => {
    setPermission(value);
  };

  const _handleInvitation = () => {
    const itemEmail = dashboard.listEmail?.filter(item => item.email === email);
    if (itemEmail.length) {
      dispatch(
        actions.invitationRequest({
          data: itemEmail,
          permission,
          token,
          history,
          orgId,
        }),
      );
    } else {
      dispatch(
        actions.invitationRequest({
          data: { email },
          permission,
          token,
          history,
          orgId,
        }),
      );
    }
    setEmail('');
    setIsShowInvitationModal(false);
  };

  useEffect(() => {
    const profileIcon = document.getElementById(
      'profile-icon',
    ) as HTMLDivElement;
    if (profileIcon) {
      profileIcon.addEventListener('click', () => {
        setIsShowUserModal(true);
      });

      document.addEventListener('click', event => {
        const accountModal = document.getElementById('account-modal');
        if (accountModal) {
          if (
            !(
              accountModal.contains(event.target as Node) ||
              profileIcon.contains(event.target as Node)
            )
          ) {
            setIsShowUserModal(false);
          }
        }
      });
    }
  }, []);

  const handleLogOut = () => {
    dispatch(globalActions.removeAuth());
    localStorage.clear();
    history.push('/auth/login');
  };

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Description of Dashboard" />
      </Helmet>

      {isShowUserModal && (
        <UserModal
          organization={organization}
          logOut={() => handleLogOut()}
          showInvite={() => setIsShowInvitationModal(true)}
        />
      )}
      <Tabs defaultActiveKey="1" tabPosition="left" className="dashboard">
        <TabPane tab={<img src={pageIcon} alt="page" />} key="1">
          <Div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('/board')}
            >
              New Board
            </Button>
            <h3 className="dashboard__tab-title">My Boards</h3>
            {organization && <BoardList orgId={organization.orgId} />}
          </Div>
        </TabPane>
        <TabPane tab={<img src={dashboardIcon} alt="dashboard" />} key="2">
          <Div>
            <Button
              hidden={isShowAddNewCanvas}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsShowAddNewCanvas(true)}
            >
              Create Canvas
            </Button>
            <div
              hidden={!isShowAddNewCanvas}
              style={{
                display: 'inline-flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '20px',
              }}
            >
              <Input placeholder="Name" style={{ width: 300, flexShrink: 0 }} />
              <Select
                defaultValue=""
                style={{ width: 220, flexShrink: 0 }}
                allowClear
              >
                <Select.Option value="" disabled>
                  Category
                </Select.Option>
                <Select.Option value="Customer Journey Maps" disabled>
                  Customer Journey Maps
                </Select.Option>
                <Select.Option value=" Innovation" disabled>
                  Innovation
                </Select.Option>
                <Select.Option value=" Business model" disabled>
                  Business model
                </Select.Option>
                <Select.Option value="Product">Product</Select.Option>
                <Select.Option value="Marketing">Marketing</Select.Option>
              </Select>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => history.push('/create-canvas')}
              >
                Create Canvas
              </Button>
            </div>

            <h3 className="dashboard__tab-title">Custom Canvas</h3>
            <Row gutter={20}>
              {new Array(1).fill(0).map((item, index) => (
                <Col key={index} span={6}>
                  <Card
                    style={{ marginTop: 20 }}
                    cover={
                      <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                    }
                    actions={[
                      'Journey Ideas',
                      <EllipsisOutlined key="ellipsis" />,
                    ]}
                  />
                </Col>
              ))}
            </Row>
          </Div>
        </TabPane>
      </Tabs>

      {isShowInvitationModal && (
        <InviteMemberModal
          onCancel={() => setIsShowInvitationModal(false)}
          handleInvitation={_handleInvitation}
          listEmail={dashboard.listEmail}
          email={email}
          handleSearch={handleSearch}
          handleSelectEmail={_handleSelectEmail}
          handleChangePermission={_handleChangePermission}
        />
      )}
    </>
  );
});

const Div = styled.div`
  padding-top: 24px;
`;
