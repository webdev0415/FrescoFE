import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useParams, useHistory } from 'react-router-dom';

import './styles.less';
import { useWorkspaceContext } from '../../../context/workspace';
import { OrganizationApiService } from '../../../services/APIService/OrganizationApi.service';
import { OrganizationsApiService } from '../../../services/APIService/OrganizationsApi.service';
import { useWorkspacesContext } from '../../../context/workspaces';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { actions as globalActions } from '../../slice';

interface AuthLayoutProps {
  children: React.ReactNode;
}
const { Content } = Layout;

const AuthLayout: React.FC<AuthLayoutProps> = props => {
  const params: { orgId?: string } = useParams();
  const history: any = useHistory();
  const { setOrganization } = useWorkspaceContext();
  const { setOrganizations } = useWorkspacesContext();

  const dispatch = useDispatch();

  const fetchMe = async () => {
    const authInformation = localStorage.getItem('authInformation');

    if (authInformation) {
      const { token } = JSON.parse(authInformation);
      if (token && token.accessToken) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token.accessToken}`;
        const response = await axios.get('users/me');
        if (response) {
          dispatch(globalActions.setUserData(response.data));
        }
      }
    }
  };

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (params.orgId) {
      OrganizationApiService.getById(params.orgId).subscribe(
        result => {
          console.log(result);
          setOrganization(result);
        },
        error => {
          console.error(error);
        },
      );

      OrganizationsApiService.list().subscribe(
        result => {
          if (result.length) {
            setOrganizations(result);
          } else {
            history.push('/auth/welcome-page');
          }
        },
        error => {
          history.push('/auth/welcome-page');
        },
      );
    }
  }, [history, params.orgId, setOrganization, setOrganizations]);

  return (
    <Layout>
      {/* <Header isLogIn={Auth.isLogged()} /> */}
      <Content>{props.children}</Content>
    </Layout>
  );
};
export default AuthLayout;
