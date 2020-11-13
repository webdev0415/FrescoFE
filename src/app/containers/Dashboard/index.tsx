/**
 *
 * Dashboard
 *
 */

import React, { memo, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Input, Menu, Select, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, Redirect, useHistory } from 'react-router-dom';

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
import Axios from 'axios';
import { BoardApiService, CanvasApiService } from 'services/APIService';
import {
  BoardInterface,
  CanvasCategoryInterface,
  CanvasResponseInterface,
} from '../../../services/APIService/interfaces';
import { InviteMemberModal } from '../../components/InviteMemberModal';
import { CanvasBoardTemplates } from '../../components/CanvasBoardTemplates';
import { CanvasCategoryService } from '../../../services/APIService/CanvasCategory.service';
import { v4 as uuidv4 } from 'uuid';
const { TabPane } = Tabs;
export const PERMISSION = {
  // ADMIN: 'admin',
  EDITOR: 'editor',
  VIEW: 'view',
};

interface Props {
  match?: any;
}

interface CanvasFormState {
  name: string;
  orgId: string;
  data: string;
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
  const [canvasName, setCanvasName] = useState('');
  const [categories, setCategories] = useState<CanvasCategoryInterface[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [canvasList, setCanvasList] = useState<CanvasResponseInterface[]>([]);
  const [boardsList, setBoardsList] = useState<BoardInterface[]>([]);
  const [showAddNewBoard, setAddNewBoard] = useState(false);

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
        console.log(response);
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

  const createCanvas = useCallback(() => {
    const data = {
      name: canvasName,
      orgId: orgId,
      data: '',
      categoryId: categoryId,
      imageId: uuidv4(),
    };
    CanvasApiService.create(data).subscribe(
      data => {
        console.log(data);
        history.push(`/canvas/${data.id}/canvas`);
      },
      error => {
        console.error(error.response);
      },
    );
  }, [canvasName, history, orgId, categoryId]);

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

  const handleDeleteCanvas = (id: string) => {
    CanvasApiService.deleteById(id, orgId).subscribe(
      data => {
        console.log(data);
        setCanvasList(canvasList.filter(item => item.id !== id));
      },
      error => {
        console.error(error);
      },
    );
  };

  const handleDeleteBoard = (id: string, userId: string) => {
    BoardApiService.deleteById(id, {
      orgId: orgId as string,
      boardId: id,
      userId: userId,
    }).subscribe(
      data => {
        console.log(data);
        setBoardsList(boardsList.filter(item => item.id !== id));
      },
      error => {
        console.error(error);
      },
    );
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

  const getCanvasList = useCallback(() => {
    CanvasApiService.getByOrganizationId(orgId).subscribe(data => {
      setCanvasList(data);
    });
  }, [orgId]);

  const getCategoriesList = () => {
    CanvasCategoryService.list().subscribe(data => {
      setCategories(data);
    });
  };

  const getBoardsList = useCallback(() => {
    BoardApiService.getByOrganizationId(orgId).subscribe(data => {
      setBoardsList(data);
    });
  }, [orgId]);

  useEffect(() => {
    getCanvasList();
  }, [getCanvasList, orgId]);

  useEffect(() => {
    getCategoriesList();
  }, [orgId, showAddNewBoard]);

  useEffect(() => {
    getBoardsList();
  }, [getBoardsList, orgId, showAddNewBoard]);

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

      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        className="side-bar-tabs"
        onChange={() => {
          getBoardsList();
          getCanvasList();
          getCategoriesList();
        }}
      >
        <TabPane tab={<img src={pageIcon} alt="page" />} key="1">
          {showAddNewBoard && (
            <CanvasBoardTemplates
              orgId={orgId}
              onClose={() => setAddNewBoard(false)}
            />
          )}

          <div className="card-section">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddNewBoard(true)}
            >
              New Board
            </Button>
            <h3 className="card-section-title">My Boards</h3>

            <div className="card-grid">
              {boardsList.map((data, index) => (
                <div className="cards-board" key={index}>
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />

                  <div className="card-footer">
                    <div className="card-action">
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item key="0">
                              <Link to={`/canvas/${data.id}/board`}>Edit</Link>
                            </Menu.Item>
                            <Menu.Item key="1">
                              <a href="http://www.taobao.com/">Action</a>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              key="3"
                              onClick={() =>
                                handleDeleteBoard(data.id, data.createdUserId)
                              }
                            >
                              Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={['click']}
                      >
                        <div className="action-button">
                          <span className="material-icons">more_vert</span>
                        </div>
                      </Dropdown>
                    </div>
                    <div className="card-title">{data.name}</div>
                    <div className="card-timestamp">Opened Oct 12, 2020</div>
                    <div className="card-users">
                      <span className="material-icons">group</span>
                      <span className="user-title">
                        Anup Surendan, JJ and 5+ collaborating
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPane>
        <TabPane tab={<img src={dashboardIcon} alt="dashboard" />} key="2">
          <div className="card-section">
            <Button
              hidden={isShowAddNewCanvas}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsShowAddNewCanvas(true);
                setCanvasName('');
              }}
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
              <Input
                placeholder="Name"
                name="name"
                onChange={event => setCanvasName(event.currentTarget.value)}
                style={{ width: 300, flexShrink: 0 }}
              />
              <Select
                defaultValue=""
                style={{ width: 220, flexShrink: 0 }}
                onChange={value => {
                  setCategoryId(value);
                }}
                allowClear
              >
                <Select.Option value="" disabled>
                  Category
                </Select.Option>
                {categories.map(item => (
                  <Select.Option value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={createCanvas}
                disabled={!categoryId || !canvasName}
              >
                Create Canvas
              </Button>
            </div>

            <h3 className="card-section-title">Custom Canvas</h3>
            <div className="card-grid">
              {canvasList.map((data, index) => (
                <div className="cards-board" key={index}>
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />

                  <div className="card-footer">
                    <div className="card-action">
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item key="0">
                              <Link to={`/canvas/${data.id}/canvas`}>Edit</Link>
                            </Menu.Item>
                            <Menu.Item key="1">
                              <a href="http://www.taobao.com/">Action</a>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              key="3"
                              onClick={() => handleDeleteCanvas(data.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={['click']}
                      >
                        <div className="action-button">
                          <span className="material-icons">more_vert</span>
                        </div>
                      </Dropdown>
                    </div>
                    <div className="card-title">{data.name}</div>
                    <div className="card-timestamp">Opened Oct 12, 2020</div>
                    <div className="card-users">
                      <span className="material-icons">group</span>
                      <span className="user-title">
                        Anup Surendan, JJ and 5+ collaborating
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
