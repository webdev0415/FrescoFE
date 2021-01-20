import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './styles.less';
import { Person, Billing, Workspace, Teams } from 'assets/icons';

import { WorkspacePage } from '../WorkspacePage';
import { MembersPage } from '../MembersPage';
import { TeamsPage } from '../TeamsPage';
import { BillingsPage } from '../BillingsPage';
import { useWorkspaceContext } from '../../../context/workspace';
import routes from '../../../routes/routesCode';
import Auth from '../../../services/Auth';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import { selectUser } from '../../selectors';

const { Sider, Content } = Layout;

const menuItems = {};
menuItems[routes.workspaceSettings.path] = 'workspaceSettings';
menuItems[routes.workspaceSettingsMembers.path] = 'workspaceSettingsMembers';
menuItems[routes.workspaceSettingsTeams.path] = 'workspaceSettingsTeams';
menuItems[routes.workspaceSettingsBillings.path] = 'workspaceSettingsBillings';

export const WorkspaceSettings = ({ match }) => {
  const { organization } = useWorkspaceContext();
  const defaultSelectedKeys = menuItems[match.path]
    ? [menuItems[match.path]]
    : [];

  return organization ? (
    <Router>
      <Header isLogIn={Auth.isLogged()} />
      <Layout>
        <Sider width={300} theme="light">
          <h2 style={{ padding: '16px 30px', marginBottom: 0 }}>
            {organization.organizationName}
          </h2>

          <Menu defaultSelectedKeys={defaultSelectedKeys}>
            <Menu.Item key={menuItems[routes.workspaceSettings.path]}>
              <span className="icon">
                <Workspace />
              </span>
              <span className="menu-item-name">Workspace</span>
              <Link to={`/organization/${organization.orgId}/settings`} />
            </Menu.Item>
            <Menu.Item key={menuItems[routes.workspaceSettingsMembers.path]}>
              <span className="icon">
                <Person />
              </span>
              <span className="menu-item-name">Members</span>
              <Link
                to={`/organization/${organization.orgId}/settings/members`}
              />
            </Menu.Item>
            <Menu.Item key={menuItems[routes.workspaceSettingsTeams.path]}>
              <span className="icon">
                <Teams />
              </span>
              <span className="menu-item-name">Teams</span>
              <Link to={`/organization/${organization.orgId}/settings/teams`} />
            </Menu.Item>
            <Menu.Item key={menuItems[routes.workspaceSettingsBillings.path]}>
              <span className="icon">
                <Billing />
              </span>
              <span className="menu-item-name">Billing</span>
              <Link
                to={`/organization/${organization.orgId}/settings/billings`}
              />
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ padding: 30, background: '#ffffff' }}>
          <Route
            exact
            path={`/organization/${organization.orgId}/settings`}
            component={WorkspacePage}
          />
          <Route
            exact
            path={`/organization/${organization.orgId}/settings/members`}
            component={MembersPage}
          />
          <Route
            exact
            path={`/organization/${organization.orgId}/settings/teams`}
            component={TeamsPage}
          />
          <Route
            exact
            path={`/organization/${organization.orgId}/settings/billings`}
            component={BillingsPage}
          />
        </Content>
      </Layout>
    </Router>
  ) : (
    <></>
  );
};
