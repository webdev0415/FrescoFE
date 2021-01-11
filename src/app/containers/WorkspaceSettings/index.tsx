import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './styles.less';
import { Person, Billing, Workspace, Teams } from 'assets/icons';

import { WorkspacePage } from '../WorkspacePage';
import { MembersPage } from '../MembersPage';
import { TeamsPage } from '../TeamsPage';
import { BillingsPage } from '../BillingsPage';

const { Sider, Content } = Layout;

export const WorkspaceSettings = ({ match }) => {
  return (
    <Router>
      <Layout>
        <Sider width={300} theme="light">
          <h2 style={{ padding: '16px 30px', marginBottom: 0 }}>
            Question Pro
          </h2>

          <Menu defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <span className="icon">
                <Workspace />
              </span>
              <span className="menu-item-name">Workspace</span>
              <Link to={`${match.url}/workspace`} />
            </Menu.Item>
            <Menu.Item key="2">
              <span className="icon">
                <Person />
              </span>
              <span className="menu-item-name">Members</span>
              <Link to={`${match.url}/members`} />
            </Menu.Item>
            <Menu.Item key="3">
              <span className="icon">
                <Teams />
              </span>
              <span className="menu-item-name">Teams</span>
              <Link to={`${match.url}/teams`} />
            </Menu.Item>
            <Menu.Item key="4">
              <span className="icon">
                <Billing />
              </span>
              <span className="menu-item-name">Billing</span>
              <Link to={`${match.url}/billings`} />
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ padding: 30, background: '#ffffff' }}>
          <Route
            exact
            path={`${match.url}/workspace`}
            component={WorkspacePage}
          />
          <Route exact path={`${match.url}/members`} component={MembersPage} />
          <Route exact path={`${match.url}/teams`} component={TeamsPage} />
          <Route
            exact
            path={`${match.url}/billings`}
            component={BillingsPage}
          />
        </Content>
      </Layout>
    </Router>
  );
};
