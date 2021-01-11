/**
 *
 * WelcomePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Typography, Spin, Input } from 'antd';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectWelcomePage } from './selectors';
import { welcomePageSaga } from './saga';
import { selectToken, selectUser } from '../../selectors';

import { OrganizationsApiService } from 'services/APIService/OrganizationsApi.service';
import { selectSelectOrganizationPage } from '../SelectOrganizationPage/selectors';
import axios from 'axios';

interface Props {
  location: any;
}

const Div = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WelcomePage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: welcomePageSaga });
  const authInfo = localStorage.getItem('authInformation')
    ? JSON.parse(localStorage.getItem('authInformation') || '')
    : null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const welcomePage = useSelector(selectWelcomePage);
  const user = useSelector(selectUser);

  let token = useSelector(selectToken);

  if (authInfo && authInfo.token && authInfo.token.accessToken) {
    token = authInfo.token.accessToken;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const { Title, Text } = Typography;
  const history = useHistory();
  const queryParams = new URLSearchParams(props.location.search);
  const [userOrg, setUserOrg] = useState(false);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const selectOrganizationPage = useSelector(selectSelectOrganizationPage);
  const [uniqueError, setUniqueError] = useState(false);


 const  string_to_slug = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    let to = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  const createWorkspace = () => {


    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.post('organization/', {
      name: workspaceName,
      fName: '0',
      lName: '0',
      slug: string_to_slug(workspaceName),
    }).then((response) => {
      history.push('/')
    }).catch((err) => {
     console.log(err.response.data.message)
      setUniqueError(err.response.data.message)
    })
  }

  useEffect(() => {
    if (token || !queryParams.get('accessToken')) return;
    dispatch(
      actions.signInRequest({ token: queryParams.get('accessToken'), history }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    OrganizationsApiService.list().subscribe(data => {
      if (data.length > 0) {
        setUserOrg(data[0].organizationName);
      }
    });
  }, [user]);

  const { loading } = welcomePage;

  if (loading) {
    return (
      <Div>
        <Spin size="large" />
      </Div>
    );
  }

  return (
    <div
      style={{
        width: '532px',
        margin: '0px auto',
      }}
    >
      <Helmet>
        <title>SignIn</title>
        <meta name="description" content="Description of SignIn" />
      </Helmet>

      <Div>
        <Card style={{
          width: '400px'
        }}>
          <Title style={{ textAlign: 'center', color: '#5D2E8C' }} level={3}>
            Welcome to Fresco
          </Title>
          <div style={{ textAlign: 'center', marginTop: 45 }}>
            <Text>
              But before we get started
            </Text>
          </div>
          <div style={{marginTop: 20}}>
            <Input
              placeholder="Workspace Name"
              title="Workspace Name"
              value={workspaceName}
              onChange={({ target: { value } }) => setWorkspaceName(value)}
            />
          </div>
          <div>
            <Text style={{textAlign: 'center', display: 'block', marginTop: '15px'}}>{uniqueError}</Text>
          </div>
          <div style={{ textAlign: 'center', marginTop: 128, fontSize: '12px' }}>
            <Text>Workspace URL: frescopad.com/{string_to_slug(workspaceName)}</Text>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ background: '9646f5', marginTop: 29 }}
            loading={selectOrganizationPage.loading}
            onClick={createWorkspace}
          >
            Continue
          </Button>
        </Card>
      </Div>
    </div>
  );
});
