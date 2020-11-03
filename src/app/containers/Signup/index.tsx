/**
 *
 * Signup
 *
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Input, Button, Card, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectSignup } from './selectors';
import { signupSaga } from './saga';

interface Props {}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Title } = Typography;

export const Signup = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: signupSaga });
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading } = useSelector(selectSignup);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const onFinish = values => {
    console.log('Success:', values);
    dispatch(actions.signUpRequest({ data: values, history }));
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{
        width: '532px',
        boxShadow: '0 2px rgba(0,0,0, 0.1)',
        margin: '100px auto',
      }}
    >
      <Helmet>
        <title>Sign up</title>
        <meta name="description" content="Description of Signup" />
      </Helmet>
      <Card bodyStyle={{ margin: '24px 92px', padding: 0 }}>
        <Title
          style={{ textAlign: 'center', marginBottom: 32, color: '#5D2E8C' }}
          level={3}
        >
          Sign Up
        </Title>
        <Form
          {...layout}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/* <Form.Item
            label="Username"
            name="name"
            rules={[{ required: true, message: 'Please input your Name!' }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="Work Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              { required: true, message: 'Please input your email address!' },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (value.length >= 8) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'The passowrd are more than 8 characters!',
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'The two passwords that you entered do not match!',
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            style={{ marginTop: 20 }}
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Sign Up
          </Button>
          <Button
            type="link"
            onClick={() => {
              history.push('/auth/login');
            }}
            style={{ float: 'right', marginRight: -15, marginTop: 10 }}
          >
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
});
