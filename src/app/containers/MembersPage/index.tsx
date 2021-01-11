import React, { Fragment } from 'react';
import { Table, Button, Divider, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.less';

const { Option } = Select;

interface DataType {
  key: React.Key;
  name: string;
  role: string;
  email: string;
  lastaccess: string;
}

export const MembersPage = () => {
  const [selectedRowKeys, setSelectRowKeys] = React.useState<string[]>([]);
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
      dataIndex: 'role',
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

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      role: 'admin',
      email: 'john@gmail.com',
      lastaccess: '1 hour ago',
    },
    {
      key: '2',
      name: 'Jim Green',
      role: 'owner',
      email: 'jim@gmail.com',
      lastaccess: '2 hour ago',
    },
    {
      key: '3',
      name: 'Joe Black',
      role: 'admin',
      email: 'joe@gmail.com',
      lastaccess: '3 hour ago',
    },
    {
      key: '4',
      name: 'John Doe',
      role: 'user',
      email: 'johndoe@gmail.com',
      lastaccess: '4 hour ago',
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
          dataSource={data}
        />
      </div>
    </Fragment>
  );
};
