import React, { Fragment, useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'antd';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { useSelector, useDispatch } from 'react-redux';

import { selectToken } from 'app/selectors';
import styled from 'styled-components';
import { Select } from 'antd';

import { useWorkspaceContext } from '../../../context/workspace';
import { TeamsApiService } from '../../../services/APIService/TeamsApi.service';
import { selectCreateTeam } from '../CreateTeamModal/selectors';
import { actions, reducer, sliceKey } from '../CreateTeamModal/slice';
import { createTeamSaga } from '../CreateTeamModal/saga';

const { Option } = Select;

export const UpdateTeamMembersModal = ({ onCancel, onUpdateTeam, team }) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: createTeamSaga });
  const { organization } = useWorkspaceContext();
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
    TeamsApiService.updateMembers(team.id, values).subscribe(
      data => {
        onUpdateTeam(data);
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
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{team.name}</p>
          <Form
            layout="vertical"
            name="create_team"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="Add Team Members" name="teammembers">
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                onChange={handleChangeOption}
              >
                {renderWorkspaceMembers()}
              </Select>
            </Form.Item>

            <DivFlexEnd>
              <Button type="primary" htmlType="submit">
                Add Team Members
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
