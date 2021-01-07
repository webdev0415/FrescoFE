import React, { Fragment, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { isEmail } from 'class-validator';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/style.css';
import styled from 'styled-components';

import { actions, reducer, sliceKey } from './slice';
import { createTeamModalSaga } from './saga';

export const CreateTeamModal = ({ onCancel, onCreateNewTeam }) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: createTeamModalSaga });

  const [emails, setEmails] = useState<string[]>([]);

  const handleOnCancel = () => {
    onCancel();
  };

  const onFinish = values => {
    onCreateNewTeam(values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Fragment>
      <Modal visible={true} footer={null} onCancel={() => handleOnCancel()}>
        <div style={{ width: '90%', margin: 'auto' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>New Team</p>
          <Form
            layout="vertical"
            name="create_team"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Team Name"
              name="teamname"
              rules={[{ required: true, message: 'Please input a team name' }]}
            >
              <Input placeholder="Team Name" />
            </Form.Item>

            <Form.Item
              label="Add team members"
              name="teammembers"
              rules={[{ required: true, message: 'Please add team memebers' }]}
            >
              <ReactMultiEmail
                placeholder="Enter a name or email"
                style={{ fontSize: '16px' }}
                emails={emails}
                onChange={(_emails: string[]) => {
                  setEmails(_emails);
                }}
                validateEmail={email => {
                  return isEmail(email); // return boolean
                }}
                getLabel={(
                  email: string,
                  index: number,
                  removeEmail: (index: number) => void,
                ) => {
                  return (
                    <div
                      data-tag
                      key={index}
                      style={{ backgroundColor: '#e4e4e4' }}
                    >
                      {email}
                      <span data-tag-handle onClick={() => removeEmail(index)}>
                        ×
                      </span>
                    </div>
                  );
                }}
              />
            </Form.Item>

            <DivFlexEnd>
              <Button type="primary" htmlType="submit">
                Create Team
              </Button>
            </DivFlexEnd>
          </Form>
        </div>
      </Modal>
    </Fragment>
  );
};

const DivFlexEnd = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 50px;
`;
