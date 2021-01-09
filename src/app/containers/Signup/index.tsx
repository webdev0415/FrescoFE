/**
 *
 * Signup
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Modal,
  message,
  Col,
  Row,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectSignup } from './selectors';
import { signupSaga } from './saga';
import { resendConfirmationEmail } from '../../../services/AuthAPI';

interface Props {}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Title } = Typography;

interface ConfirmationState {
  loading: boolean;
  success: string;
  error: string;
}

export const Signup = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: signupSaga });
  const [email, setEmail] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    error: '',
    success: '',
    loading: false,
  });
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, errorCode } = useSelector(selectSignup);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const handleResendEmail = () => {
    setConfirmation({
      ...confirmation,
      loading: true,
    });
    resendConfirmationEmail(email)
      .then(response => {
        setConfirmation({
          ...confirmation,
          loading: false,
          success: 'Confirmation Link has been sent',
        });
        Modal.destroyAll();
        message.success('Confirmation Link has been sent');
      })
      .catch(error => {
        setConfirmation({
          ...confirmation,
          loading: false,
          error: 'Confirmation Failed to Send',
        });
        message.error(error.message);
      });
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (errorCode === 409) {
      Modal.destroyAll();
      Modal.confirm({
        content: (
          <div>
            <p>
              User already exists with this email, please try again with
              different email address.
            </p>
            <div className="clearfix">
              <Button
                type="link"
                style={{ float: 'right' }}
                onClick={handleResendEmail}
              >
                Resend Confirmation Email
              </Button>
            </div>
          </div>
        ),
        onCancel: () => {
          dispatch(actions.signUpErrorReset());
        },
        onOk: () => {
          dispatch(actions.signUpErrorReset());
        },
      });
    }
  }, [confirmation.success, dispatch, errorCode, handleResendEmail]);
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
          <Row>
            <Col lg={11}>
              <Form.Item label="First Name" name="firstName" hasFeedback>
                <Input
                  onChange={event => {
                    setEmail(event.target.value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col lg={2}></Col>
            <Col lg={11}>
              <Form.Item label="Last Name" name="lastName" hasFeedback>
                <Input
                  onChange={event => {
                    setEmail(event.target.value);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Work Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              },
              { required: true, message: 'Please input your email address!' },
            ]}
            hasFeedback
          >
            <Input
              onChange={event => {
                setEmail(event.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            help="Your password should be at least 8 characters"
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
          <div
            style={{
              margin: '10px 0',
              padding: '0 15px',
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          >
            By creating an account, you agree to our User Terms and Privacy
            Policy.
          </div>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign Up
          </Button>
        </Form>
      </Card>
    </div>
  );
});
