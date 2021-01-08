import React, { Fragment, useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';

export const CreateWorkspaceModal = ({ onCancel, onCreateWorkspace }) => {
  const { Title, Text } = Typography;
  const [workspaceName, setWorkspaceName] = useState<string>('');

  const handleOnCancel = () => {
    onCancel();
  };

  const onFinish = values => {
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
                onChange={({ target: { value } }) => setWorkspaceName(value)}
              />
            </Form.Item>

            <div
              style={{ textAlign: 'center', marginTop: 128, fontSize: '12px' }}
            >
              <Text>Workspace URL: frescopad.com/{workspaceName}</Text>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ background: '9646f5', marginTop: 29 }}
            >
              Create Workspace
            </Button>
          </Form>
        </div>
      </Modal>
    </Fragment>
  );
};
