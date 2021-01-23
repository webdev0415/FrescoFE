import React, { Fragment, useEffect } from 'react';
import { Table, Button, Divider, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.less';
import { WorkspaceMembersApiService } from '../../../services/APIService/WorkspaceMembersApi.service';
import { useWorkspaceContext } from 'context/workspace';
import { selectToken } from 'app/selectors';
import { useSelector } from 'react-redux';

const { Option } = Select;

export const MembersPage = () => {
  const [members, setMembers] = React.useState<any[]>([]);
  const [selectedRowKeys, setSelectRowKeys] = React.useState<string[]>([]);

  const token = useSelector(selectToken);
  const { organization } = useWorkspaceContext();
  const orgId = organization.orgId;

  useEffect(() => {
    if (token && orgId) {
      WorkspaceMembersApiService.getById(orgId).subscribe(
        result => {
          const workspaceMembers = result.map(member => {
            return {
              ...member,
              name: member.firstName + ' ' + member.lastName,
            };
          });
          setMembers(workspaceMembers);
        },
        error => {
          console.error(error);
        },
      );
    }
  }, [orgId, token]);

  const onSelectChange = selectedRowKeys => {
    setSelectRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChange = value => {
    console.log(`selected ${value}`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'permission',
      render: text => (
        <>
          <Select
            defaultValue={text}
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="admin">Admin</Option>
            <Option value="owner">Owner</Option>
            <Option value="user">User</Option>
          </Select>
        </>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Last Access',
      dataIndex: 'lastaccess',
    },
  ];

  return (
    <Fragment>
      <p style={{ marginBottom: 40 }}>Manage members on your workspace</p>

      <div className="members-description">
        <div style={{ textAlign: 'center', marginRight: 25 }}>
          <p>1</p>
          <Divider className="divider-border-color" />
          <p>Active</p>
        </div>
        <div style={{ textAlign: 'center', marginRight: 25 }}>
          <p>1</p>
          <Divider className="divider-border-color" />
          <p>Pending</p>
        </div>
        <div style={{ textAlign: 'center', marginRight: 25 }}>
          <p>1</p>
          <Divider className="divider-border-color" />
          <p>Remaining Seats</p>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Member
        </Button>
      </div>

      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={members}
        />
      </div>
    </Fragment>
  );
};
