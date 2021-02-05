import React, { Fragment, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Alert } from 'antd';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { useSelector, useDispatch } from 'react-redux';
import { selectCreateTeam } from './selectors';
import { selectToken } from 'app/selectors';
import styled from 'styled-components';
import { Select } from 'antd';

import { actions, reducer, sliceKey } from './slice';
import { createTeamSaga } from './saga';
import { useWorkspaceContext } from '../../../context/workspace';
import { TeamsApiService } from '../../../services/APIService/TeamsApi.service';

const { Option } = Select;

export const CreateTeamModal = ({ onCancel, onCreateNewTeam }) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: createTeamSaga });
  const { organization, setOrganization } = useWorkspaceContext();
  const [errorMessage, setErrorMessage] = useState(null);

  const selectorCreateTeam = useSelector(selectCreateTeam);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const orgId = organization;

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
    values.orgId = orgId.orgId;
    TeamsApiService.create(values).subscribe(
      data => {
        onCreateNewTeam(data);
      },
      error => {
        setErrorMessage(error.data.message);
      },
    );
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const handleChangeOption = value => {
    console.log(`selected ${value}`);
  };

  return (
    <Fragment>
      <Modal
        visible={true}
        footer={null}
        maskClosable={false}
        onCancel={() => handleOnCancel()}
      >
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
              name="name"
              rules={[{ required: true, message: 'Please input a team name' }]}
            >
              <Input placeholder="Team Name" />
            </Form.Item>

            <Form.Item label="Add Team Members" name="users">
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
            {errorMessage && <Alert message={errorMessage} type="error" />}
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
