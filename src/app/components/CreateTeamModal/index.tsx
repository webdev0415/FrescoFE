import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Modal, Form, Input, Button } from 'antd';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { useSelector, useDispatch } from 'react-redux';
import { selectCreateTeam } from './selectors';
import { selectToken } from 'app/selectors';
import styled from 'styled-components';
import { Select } from 'antd';

import { actions, reducer, sliceKey } from './slice';
import { createTeamSaga } from './saga';

const { Option } = Select;

export const CreateTeamModal = ({ onCancel, onCreateNewTeam }) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: createTeamSaga });

  const selectorCreateTeam = useSelector(selectCreateTeam);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const orgId = useParams();

  useEffect(() => {
    dispatch(
      actions.getWorkspaceMembersRequest({
        token,
        orgId,
      }),
    );
  }, [dispatch, orgId, token]);

  const renderWorkspaceMembers = () => {
    return selectorCreateTeam?.workspaceMembers.map(item => (
      <Option value={item.userId}>
        {item.firstName} {item.lastName}
      </Option>
    ));
  };

  const handleOnCancel = () => {
    onCancel();
  };

  const onFinish = values => {
    dispatch(actions.createTeamRequest({ data: values, token, orgId }));
    onCreateNewTeam(values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const handleChangeOption = value => {
    console.log(`selected ${value}`);
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
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onChange={handleChangeOption}
              >
                {renderWorkspaceMembers()}
              </Select>
            </Form.Item>

            <DivFlexEnd>
              <Button
                type="primary"
                htmlType="submit"
                loading={selectorCreateTeam.loading}
              >
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
