/**
 *
 * Dashboard
 *
 */
import React, { memo, useRef, useState } from 'react';
import { Layout, Menu, Tabs } from 'antd';
// Components
import './styles.less';
import AppLogo from '../../components/AppIcon';
import { DashboardIcon, GroupIcon, PageIcon } from '../../../assets/icons';

import { AppstoreAddOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../selectors';
import { useWorkspaceContext } from '../../../context/workspace';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { DashboardBoards } from './DashboardBoards';
import { DashboardCanvases } from './DashboardCanvases';
import { DashboardTeam } from './DashboardTeam';
import { DashboardCategories } from './DashboardCategories';
import routes from '../../../routes/routesCode';
import DashboardToggleMenu from './DashboardToggleMenu';
import { useWorkspacesContext } from '../../../context/workspaces';
import { actions as globalActions } from '../../slice';
import TeamMenu from './TeamMenu';

export const PERMISSION = {
  EDITOR: 'editor',
  VIEW: 'view',
};

interface Props {
  match?: any;
  location?: any;
}

const menuItems = {};
menuItems[routes.dashboard.path] = 'dashboard';
menuItems[routes.dashboardTeam.path] = 'dashboardTeam';
menuItems[routes.dashboardCanvases.path] = 'dashboardCanvases';
menuItems[routes.dashboardCategories.path] = 'dashboardCategories';
menuItems['profile'] = 'profile';

export const DashboardNew = memo((props: Props) => {
  const { organization, setOrganization } = useWorkspaceContext();
  const { organizations, setOrganizations } = useWorkspacesContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const params: any = useParams();
  const tabsContainerRef = useRef<any>(null);

  const gotoWorkspaceSettingsPage = (selectedWorkspace: any) => {
    history.push(`/organization/${selectedWorkspace.orgId}/settings`);
  };

  const gotoWorkspaceSettingsTeamsPage = (selectedWorkspace: any) => {
    history.push(`/organization/${selectedWorkspace.orgId}/settings/teams`);
  };

  const gotoWorkspaceSettingsBillingsPage = (selectedWorkspace: any) => {
    history.push(`/organization/${selectedWorkspace.orgId}/settings/billings`);
  };

  const defaultSelectedKeys = menuItems[props.match.path]
    ? [menuItems[props.match.path]]
    : [];

  const user = useSelector(selectUser);
  const orgId = params.orgId;

  const handleLogOut = () => {
    dispatch(globalActions.removeAuth());
    localStorage.clear();
    history.push('/auth/login');
  };

  const isAdmin = () => user && user.role === 'ADMIN';

  return (
    <Layout className="dashboard">
      <Layout>
        <div ref={tabsContainerRef}>
          <Layout.Sider width={56} className="left-sidebar">
            <AppLogo size={56} />
            <Menu
              mode="inline"
              defaultSelectedKeys={defaultSelectedKeys}
              className="sidebar-menu"
              style={{
                height: 'calc(100vh - 80px)',
                borderRight: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Menu.Item key={menuItems[routes.dashboard.path]}>
                <Link to={`/organization/${params?.orgId}`}>
                  <PageIcon />
                </Link>
              </Menu.Item>
              <Menu.Item key={menuItems[routes.dashboardTeam.path]}>
                <TeamMenu
                  offsetContainerClass=".left-sidebar"
                  offsetContainerRef={tabsContainerRef}
                />
              </Menu.Item>
              {isAdmin() && (
                <Menu.Item key={menuItems[routes.dashboardCanvases.path]}>
                  <Link to={`/organization/${params?.orgId}/canvases`}>
                    <DashboardIcon />
                  </Link>
                </Menu.Item>
              )}
              {isAdmin() && (
                <Menu.Item key={menuItems[routes.dashboardCategories.path]}>
                  <Link to={`/organization/${params?.orgId}/categories`}>
                    <AppstoreAddOutlined style={{ fontSize: 21 }} />
                  </Link>
                </Menu.Item>
              )}
              <div style={{ marginTop: 'auto', height: 55, marginBottom: 0 }}>
                {tabsContainerRef?.current && !!organization && (
                  <>
                    <DashboardToggleMenu
                      orgId={orgId}
                      organizations={organizations}
                      gotoWorkspaceSettingsBillingsPage={
                        gotoWorkspaceSettingsBillingsPage
                      }
                      gotoWorkspaceSettingsPage={gotoWorkspaceSettingsPage}
                      gotoWorkspaceSettingsTeamsPage={
                        gotoWorkspaceSettingsTeamsPage
                      }
                      handleLogOut={handleLogOut}
                      organization={organization}
                      setOrganization={setOrganization}
                      setOrganizations={setOrganizations}
                      history={history}
                      tabsContainerRef={tabsContainerRef}
                    />
                  </>
                )}
              </div>
            </Menu>
          </Layout.Sider>
        </div>
        <Layout>
          <Layout.Content style={{ padding: 25 }}>
            <Switch>
              <Route
                exact
                path={`/organization/${params?.orgId}`}
                component={() => (
                  <DashboardBoards
                    organization={organization}
                    orgId={params.orgId}
                  />
                )}
              />
              <Route
                exact
                path={`/organization/:orgId/team/:teamId`}
                component={DashboardTeam}
              />
              {isAdmin() && (
                <Route
                  exact
                  path={`/organization/${params?.orgId}/canvases`}
                  component={() => (
                    <DashboardCanvases history={history} orgId={params.orgId} />
                  )}
                />
              )}
              {isAdmin() && (
                <Route
                  exact
                  path={`/organization/${params?.orgId}/categories`}
                  component={DashboardCategories}
                />
              )}
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
});
