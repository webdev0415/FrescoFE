import React, { Fragment, useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectCreateWorkspace } from './selectors';
import { createWorkspaceSaga } from './saga';
import { selectToken } from 'app/selectors';

export const CreateWorkspaceModal = ({ onCancel, onCreateWorkspace }) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: createWorkspaceSaga });

  const selectorCreateWorkspace = useSelector(selectCreateWorkspace);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const { Title, Text } = Typography;
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [slug, setSlug] = useState<string>('Workspace: frescopad.com/');

  const handleChangeWorkspaceName = value => {
    const slug = 'Workspace: frescopad.com/' + value.replace(/ /g, '-');
    setWorkspaceName(value);
    setSlug(slug);
  };

  const handleOnCancel = () => {
    onCancel();
  };

  const onFinish = values => {
    dispatch(actions.createWorkspaceRequest({ data: values, token, slug }));
    onCreateWorkspace(values.workspacename);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Fragment>
      <Modal visible={true} footer={null} onCancel={() => handleOnCancel()}>
        <div style={{ width: '90%', margin: 'auto' }}>
          <Title
            style={{
              textAlign: 'center',
              color: '#5D2E8C',
              marginTop: '2rem',
              marginBottom: '3rem',
            }}
            level={3}
          >
            Create New Workspace
          </Title>

          <Form
            layout="vertical"
            name="create_team"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Workspace Name"
              name="workspacename"
              rules={[
                { required: true, message: 'Please input a workspace name' },
              ]}
            >
              <Input
                placeholder="Workspace Name"
                value={workspaceName}
                onChange={({ target: { value } }) =>
                  handleChangeWorkspaceName(value)
                }
              />
            </Form.Item>

            <div
              style={{ textAlign: 'center', marginTop: 128, fontSize: '12px' }}
            >
              <Text>{slug}</Text>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ background: '9646f5', marginTop: 29 }}
              loading={selectorCreateWorkspace.loading}
            >
              Create Workspace
            </Button>
          </Form>
        </div>
      </Modal>
    </Fragment>
  );
};
