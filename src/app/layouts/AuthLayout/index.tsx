import React from 'react';
import { Layout } from 'antd';
import Header from 'app/components/Header';
import Auth from 'services/Auth';

interface AuthLayoutProps {
  children: React.ReactNode;
}
const { Content } = Layout;

const AuthLayout: React.FC<AuthLayoutProps> = props => {
  return (
    <Layout>
      <Header isLogIn={Auth.isLogged()} />
      <Content style={{ padding: '0 50px' }}>{props.children}</Content>
    </Layout>
  );
};
export default AuthLayout;
