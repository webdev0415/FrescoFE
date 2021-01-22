import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useParams } from 'react-router-dom';

import './styles.less';
import { useWorkspaceContext } from '../../../context/workspace';
import { OrganizationApiService } from '../../../services/APIService/OrganizationApi.service';
import { OrganizationsApiService } from '../../../services/APIService/OrganizationsApi.service';
import { useWorkspacesContext } from '../../../context/workspaces';

interface AuthLayoutProps {
  children: React.ReactNode;
}
const { Content } = Layout;

const AuthLayout: React.FC<AuthLayoutProps> = props => {
  const params: { orgId?: string } = useParams();
  const { setOrganization } = useWorkspaceContext();
  const { setOrganizations } = useWorkspacesContext();

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
          console.log(result, 'karen organizations');
          setOrganizations(result);
        },
        error => {
          console.error(error);
        },
      );
    }
  }, [params.orgId, setOrganization, setOrganizations]);

  return (
    <Layout>
      {/* <Header isLogIn={Auth.isLogged()} /> */}
      <Content>{props.children}</Content>
    </Layout>
  );
};
export default AuthLayout;
