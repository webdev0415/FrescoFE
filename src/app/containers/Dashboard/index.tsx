/**
 *
 * Dashboard
 *
 */
import React, { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Input, Menu, Select, Skeleton, Tabs } from 'antd';
import { PlusOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, Redirect, useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';

import { selectDashboard } from './selectors';
import { selectToken, selectUser } from '../../selectors';
import { dashboardSaga } from './saga';
import { actions as globalActions } from '../../slice';

import {
  DashboardIcon,
  PageIcon,
  NotificationBell,
  QuestionMark,
  Person,
  Billing,
  Workspace,
  AddPerson,
  Teams,
  Logout,
} from 'assets/icons';
import { BarChartOutlined } from '@ant-design/icons';
import ToggleMenu from '../../components/ToggleMenu';
import styled from 'styled-components';
// Components
import { UserModal } from '../../components/UserModal';
import Axios from 'axios';
import { InviteMemberModal } from '../../components/InviteMemberModal/Loadable';
import { MyProfileModal } from '../../components/MyProfileModal/Loadable';
import { CreateWorkspaceModal } from '../../components/CreateWorkspaceModal/Loadable';
import { TeamMembersModal } from '../../components/TeamMembersModal/Loadable';
import './styles.less';
import { BoardList } from '../BoardList';
import { Categories } from '../Categories';
import { CanvasApiService } from 'services/APIService';
import {
  CanvasCategoryInterface,
  CanvasResponseInterface,
} from '../../../services/APIService/interfaces';
import { CanvasBoardTemplates } from '../../components/CanvasBoardTemplates';
import { CanvasCategoryService } from '../../../services/APIService/CanvasCategory.service';
import { Collaboration } from '../../components/Collaboration';
import moment from 'moment';
import clsx from 'clsx';
import AppLogo from 'app/components/AppIcon';
import TeamMenu from './TeamMenu';
import Avatar from 'app/components/Avatar';
import Fab from 'app/components/Fab';
import { List, Item } from 'app/components/List';

const { TabPane } = Tabs;
export const PERMISSION = {
  EDITOR: 'edit',
  VIEW: 'view',
};

interface Props {
  match?: any;
}

const TeamsToggleMenuStyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #e9e9e9;
  align-items: center;
  padding: 10px 0;
`;

const StyledBoardDetailedToggleMenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  .divided {
    margin-bottom: 10px;
    padding-bottom: 10px;
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border-bottom: 1px solid #dad7d7;
  }
  .title {
    display: flex;
    align-items: center;
    flex: 1;
    padding-left: 20px;
  }
  ul {
    flex: 5;
  }
  .logout {
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 20px;
    svg {
      margin-right: 10px;
    }
  }
`;

const StyledBoardFeaturesContainer = styled.div`
  padding: 16px;
  border-left: 1px solid #dcd4d4;
  height: 100%;
`;

export const Dashboard = memo((props: Props) => {
  const defaultCanvasName = `Untitled Canvas, ${moment().format(
    'DD/mm/yy, hh:mm A',
  )}`;
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardSaga });
  const [organization, setOrganization] = useState<any>(null);
  const [isTeamMenuOpen, setIsToggleMenuOpen] = useState<Boolean>(false);
  const [isTeamDetailedMenuOpen, setIsTeamDetailedMenuOpen] = useState<Boolean>(
    false,
  );
  const [invitePeopleToggleMenu, setInvitePeopleToggleMenu] = useState<Boolean>(
    false,
  );
  const [isShowUserModal, setIsShowUserModal] = useState(false);
  const [isShowInvitationModal, setIsShowInvitationModal] = useState(false);
  const [isShowMyProfileModal, setIsShowMyProfileModal] = useState(false);
  const [isShowTeamMembersModal, setIsShowTeamMembersModal] = useState(false);
  const [
    isShowWorkspaceCreatingModal,
    setIsShowWorkspaceCreatingModal,
  ] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState(PERMISSION.EDITOR);
  const [isModalOpen, setModalOpen] = useState(false);
  const [canvasName, setCanvasName] = useState('');
  const [categories, setCategories] = useState<CanvasCategoryInterface[]>([]);
  const [workspaces, setWorkspaces] = useState<string[]>(['John Wick']);
  const [categoryId, setCategoryId] = useState('');
  const [canvasList, setCanvasList] = useState<CanvasResponseInterface[]>([]);
  const [showAddNewBoard, setAddNewBoard] = useState(false);
  const [isShowAddNewCanvas, setIsShowAddNewCanvas] = useState(false);
  const [loadingCreateCanvas, setLoadingCreateCanvas] = useState(false);
  const [loadingCategoriesList, setLoadingCategoriesList] = useState(false);
  const [loadingCanvasList, setLoadingCanvasList] = useState(false);
  const [editCanvasItem, setEditCanvasItem] = useState('');
  const [editName, setEditName] = useState('');
  const [hoveredBoard, setHoveredBoard] = useState('');
  const [loadingUpdateName, setLoadingUpdateName] = useState(false);
  const orgId = props?.match?.params?.id;

  const tabsContainerRef = useRef<any>(null);
  const profileToggleMenuRef = useRef<any>(null);
  const teamDetailedMenuRef = useRef<any>(null);
  const invitePeopleToggleMenuRef = useRef<any>(null);
  const dashboard = useSelector(selectDashboard);
  const dispatch = useDispatch();
  const history = useHistory();

  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  useEffect(() => {
    setCanvasName(defaultCanvasName);
  }, [defaultCanvasName]);

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);
  // const user = useSelector(selectUser);
  useEffect(() => {
    if (!!dashboard.linkInvitation) {
      setEmail('');
      setIsShowInvitationModal(false);
    }
  }, [dashboard]);
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

  const createCanvas = React.useCallback(() => {
    setLoadingCreateCanvas(true);
    const data = {
      name: canvasName,
      orgId: orgId,
      data: '',
      categoryId: categoryId,
    };

    CanvasApiService.create(data).subscribe(
      data => {
        setLoadingCreateCanvas(false);
        history.push(`/canvas/${data.id}?organization=${orgId}`, { orgId });
      },
      error => {
        setLoadingCreateCanvas(false);
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
  const showInviteModal = () => {
    setIsShowInvitationModal(true);
  };
  const showMyProfileModal = () => {
    setIsShowMyProfileModal(true);
  };
  const showTeamMembersModal = () => {
    setIsShowTeamMembersModal(true);
  };

  const getCanvasList = React.useCallback(() => {
    setLoadingCanvasList(true);
    CanvasApiService.getByOrganizationId(orgId).subscribe(
      data => {
        setCanvasList(data);
        setLoadingCanvasList(false);
      },
      () => {
        setLoadingCanvasList(false);
      },
    );
  }, [orgId]);

  const getCategoriesList = () => {
    setLoadingCategoriesList(true);
    CanvasCategoryService.list().subscribe(
      data => {
        setCategories(data);
        setLoadingCategoriesList(false);
      },
      () => {
        setLoadingCategoriesList(false);
      },
    );
  };

  useEffect(() => {
    getCanvasList();
  }, [getCanvasList, orgId]);

  useEffect(() => {
    getCategoriesList();
  }, [orgId, showAddNewBoard]);

  const handleLogOut = () => {
    dispatch(globalActions.removeAuth());
    localStorage.clear();
    history.push('/auth/login');
  };

  const handleCreateWorkspace = (workspace: string) => {
    setWorkspaces(oldWorkspacesArray => [...oldWorkspacesArray, workspace]);
    setIsShowWorkspaceCreatingModal(false);
  };

  const renderWorkspaces = () => {
    return workspaces.map(item => (
      <Avatar
        style={{ marginBottom: 10 }}
        fullName={item}
        onClick={() => setIsTeamDetailedMenuOpen(true)}
      />
    ));
  };
  const renderTeamsToggleMenu = () => {
    if (tabsContainerRef.current) {
      return (
        <>
          <ToggleMenu
            width={56}
            height={350}
            isOpen={isTeamMenuOpen}
            menuRefObject={profileToggleMenuRef}
            offsetContainerRef={{
              current: tabsContainerRef.current.querySelector(
                '.ant-tabs-nav-wrap',
              ),
            }}
            ignoredContainers={[teamDetailedMenuRef, invitePeopleToggleMenuRef]}
            equalize="bottom"
            onOutsideClick={() => setIsToggleMenuOpen(false)}
          >
            <TeamsToggleMenuStyledContainer>
              {/*<Avatar
                fullName="John Wick"
                onClick={() => setIsTeamDetailedMenuOpen(true)}
              />
              <Fab size={35} onClick={() => setIsShowWorkspaceCreatingModal(true)}>+</Fab>*/}
              <div>{renderWorkspaces()}</div>
              <Fab
                size={35}
                onClick={() => setIsShowWorkspaceCreatingModal(true)}
              >
                +
              </Fab>
            </TeamsToggleMenuStyledContainer>
          </ToggleMenu>
          <ToggleMenu
            width={264}
            height={350}
            isOpen={isTeamDetailedMenuOpen}
            menuRefObject={teamDetailedMenuRef}
            offsetContainerRef={profileToggleMenuRef}
            ignoredContainers={[invitePeopleToggleMenuRef]}
            equalize="bottom"
            onOutsideClick={() => {
              setIsTeamDetailedMenuOpen(false);
              setInvitePeopleToggleMenu(false);
            }}
          >
            <StyledBoardDetailedToggleMenuContainer>
              <div
                className="title divided"
                onClick={() => setInvitePeopleToggleMenu(true)}
                style={{
                  cursor: 'pointer',
                }}
              >
                QuestionPro
              </div>
              <List className="divided">
                <Item onClick={showMyProfileModal}>
                  <span className="icon">
                    <Person />
                  </span>
                  My Profile
                </Item>
                <Item>
                  <span className="icon">
                    <NotificationBell />
                  </span>
                  Notifications
                </Item>
                <Item>
                  <span className="icon">
                    <QuestionMark />
                  </span>
                  Help
                </Item>
              </List>
              <div className="logout" onClick={() => handleLogOut()}>
                <Logout />
                Log out
              </div>
            </StyledBoardDetailedToggleMenuContainer>
          </ToggleMenu>
          <ToggleMenu
            width={264}
            height={350}
            isOpen={invitePeopleToggleMenu}
            menuRefObject={invitePeopleToggleMenuRef}
            offsetContainerRef={teamDetailedMenuRef}
            equalize="bottom"
            name="idiot variant"
            onOutsideClick={() => setInvitePeopleToggleMenu(false)}
          >
            <StyledBoardFeaturesContainer>
              <List className="divided">
                <Item onClick={showInviteModal}>
                  <span className="icon">
                    <AddPerson />
                  </span>
                  Invite people
                </Item>
              </List>
              <List className="divided">
                <Item>
                  <span className="icon">
                    <Workspace />
                  </span>
                  Workspace
                </Item>
                <Item onClick={showTeamMembersModal}>
                  <span className="icon">
                    <Person />
                  </span>
                  Members
                </Item>
                <Item>
                  <span className="icon">
                    <Teams />
                  </span>
                  Teams
                </Item>
                <Item>
                  <span className="icon">
                    <Billing />
                  </span>
                  Billing
                </Item>
              </List>
              <List>
                <Item style={{ paddingTop: '15px' }}>
                  Sign Out of QuestionPro
                </Item>
              </List>
            </StyledBoardFeaturesContainer>
          </ToggleMenu>
        </>
      );
    }
    return null;
  };

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  const handleClickRename = (id: string) => {
    setEditCanvasItem(id);
  };

  const handleChangeName = (event: any) => {
    setEditName(event.target.value);
  };
  const onSaveName = () => {
    const id = editCanvasItem;
    const name = editName;
    const item = canvasList.find(i => i.id === id);
    if (item) {
      setLoadingUpdateName(true);
      const data = {
        ...item,
        name: name,
      };
      CanvasApiService.updateById(id, data).subscribe(
        () => {
          setLoadingUpdateName(false);
          setEditName('');
          setEditCanvasItem('');
          getCanvasList();
        },
        error => {
          setLoadingUpdateName(false);
          console.error(error);
        },
      );
    }
  };

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
      <div ref={tabsContainerRef}>
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          className="dashboard"
          tabBarExtraContent={{
            right: (
              <Avatar
                fullName="John Wick"
                onClick={() => setIsToggleMenuOpen(!isTeamMenuOpen)}
              />
            ),
          }}
        >
          <TabPane
            tab={<AppLogo size={56} />}
            key="1000"
            disabled
            className="tab-pane-icon"
          />
          <TabPane tab={<PageIcon />} key="1">
            {showAddNewBoard ? (
              <CanvasBoardTemplates
                orgId={orgId}
                onClose={() => setAddNewBoard(false)}
              />
            ) : (
              <div className="card-section">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddNewBoard(true)}
                >
                  New Board
                </Button>
                <h3 className="dashboard__tab-title">My Boards</h3>
                {organization && <BoardList orgId={organization.orgId} />}
              </div>
            )}
          </TabPane>
          <TabPane
            disabled
            key="2"
            tab={<TeamMenu offsetContainerRef={tabsContainerRef} />}
          />
          <TabPane tab={<DashboardIcon />} key="3">
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
                  loading={loadingCategoriesList}
                  allowClear
                >
                  <Select.Option value="" disabled>
                    Category
                  </Select.Option>
                  {categories.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={createCanvas}
                  disabled={!categoryId || !canvasName}
                  loading={loadingCreateCanvas}
                >
                  Create Canvas
                </Button>
              </div>
              <h3 className="card-section-title">Custom Canvas</h3>
              <div className="card-grid">
                {!loadingCanvasList && !canvasList.length && (
                  <h3
                    style={{
                      width: '100%',
                      color: 'red',
                      textAlign: 'center',
                    }}
                  >
                    No Canvases
                  </h3>
                )}
                {canvasList.map((data, index) => (
                  <div
                    className={`cards-board ${
                      hoveredBoard === data.id ? 'active' : ''
                    }`}
                    key={index}
                    onMouseEnter={() => {
                      setHoveredBoard(data.id);
                    }}
                    onMouseLeave={() => {
                      setHoveredBoard('');
                    }}
                  >
                    <Link
                      to={{
                        pathname: `/canvas/${data.id}?organization=${orgId}`,
                        state: { orgId },
                      }}
                    >
                      <img
                        alt="example"
                        style={{
                          border: '1px solid #f0f2f5',
                          backgroundColor: 'white',
                        }}
                        src={
                          data.path ||
                          'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                        }
                      />
                    </Link>
                    <div className="card-footer">
                      <div className="card-action">
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item key="0">
                                <Link
                                  to={{
                                    pathname: `/canvas/${data.id}?organization=${orgId}`,
                                    state: { orgId },
                                  }}
                                >
                                  Edit
                                </Link>
                              </Menu.Item>
                              <Menu.Item
                                key="1"
                                onClick={() => handleClickRename(data.id)}
                              >
                                Rename
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
                      {editCanvasItem !== data.id && (
                        <div className="card-title">
                          {data.name}
                          {data && data.name && data.name.length >= 34 ? (
                            <span className="tooltip">{data.name}</span>
                          ) : (
                            ''
                          )}
                        </div>
                      )}
                      {editCanvasItem === data.id && (
                        <div className="card-title-input">
                          <Input
                            addonAfter={
                              <>
                                {!loadingUpdateName && (
                                  <SaveOutlined
                                    onClick={onSaveName}
                                    style={{ cursor: 'pointer' }}
                                  />
                                )}
                                {loadingUpdateName && <LoadingOutlined />}
                              </>
                            }
                            defaultValue={data.name}
                            onChange={handleChangeName}
                          />
                        </div>
                      )}
                      <div className="card-timestamp">
                        {data && data.createdAt
                          ? moment(data.createdAt).format('LLL')
                          : ''}
                      </div>
                      <div className="card-users">
                        <span className="material-icons">group</span>
                        <Collaboration users={data.users} />
                      </div>
                    </div>
                  </div>
                ))}
                {loadingCanvasList &&
                  Array(5)
                    .fill(1)
                    .map((item, index) => (
                      <div className="cards-board" key={item + index}>
                        <Skeleton.Image />

                        <div className="card-footer">
                          <Skeleton
                            active
                            paragraph={{ rows: 0, style: { display: 'none' } }}
                            title={{ width: '100%', style: { marginTop: 0 } }}
                            className="card-title"
                          />
                          <Skeleton
                            active
                            paragraph={{ rows: 0, style: { display: 'none' } }}
                            title={{ width: '100%', style: { marginTop: 0 } }}
                            className="card-timestamp"
                          />

                          <Skeleton
                            active
                            paragraph={{ rows: 0, style: { display: 'none' } }}
                            title={{ width: '100%', style: { marginTop: 0 } }}
                            className="card-users"
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </TabPane>
          {user && user.role === 'ADMIN' && (
            <TabPane tab={<BarChartOutlined />} key="4">
              <div className="card-section">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  New Category
                </Button>
                <h3 className="dashboard__tab-title">Categories</h3>
                <Categories
                  visible={isModalOpen}
                  onCancel={() => {
                    setModalOpen(false);
                  }}
                />
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>

      {isShowInvitationModal && (
        <InviteMemberModal
          onCancel={() => setIsShowInvitationModal(false)}
          handleInvitation={_handleInvitation}
          listEmail={dashboard.listEmail}
          email={email}
          loading={dashboard.loading}
          handleSearch={handleSearch}
          handleSelectEmail={_handleSelectEmail}
          handleChangePermission={_handleChangePermission}
        />
      )}
      {isShowMyProfileModal && (
        <MyProfileModal
          onCancel={() => setIsShowMyProfileModal(false)}
          loading={dashboard.loading}
          useremail={user && user.email}
        />
      )}
      {isShowTeamMembersModal && (
        <TeamMembersModal
          onCancel={() => setIsShowTeamMembersModal(false)}
          loading={dashboard.loading}
        />
      )}
      {isShowWorkspaceCreatingModal && (
        <CreateWorkspaceModal
          onCancel={() => setIsShowWorkspaceCreatingModal(false)}
          onCreateWorkspace={handleCreateWorkspace}
        />
      )}
      {renderTeamsToggleMenu()}
    </>
  );
});
