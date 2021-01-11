import React, { Fragment } from 'react';
import { Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.less';

const columns = [
  {
    title: 'Team Name',
    dataIndex: 'teamname',
  },
  {
    title: 'Members',
    dataIndex: 'members',
  },
  {
    title: 'Created by',
    dataIndex: 'createdby',
  },
  {
    title: 'Creation date',
    dataIndex: 'creationdate',
  },
];

interface DataType {
  key: React.Key;
  teamname: string;
  members: number;
  createdby: string;
  creationdate: string;
}

const data: DataType[] = [
  {
    key: '1',
    teamname: 'Testing',
    members: 5,
    createdby: 'John Brown',
    creationdate: '10/10/2020',
  },
  {
    key: '2',
    teamname: 'Design',
    members: 2,
    createdby: 'Jim Green',
    creationdate: '10/10/2020',
  },
  {
    key: '3',
    teamname: 'Frontend',
    members: 4,
    createdby: 'Joe Black',
    creationdate: '10/10/2020',
  },
  {
    key: '4',
    teamname: 'Backend',
    members: 1,
    createdby: 'John Doe',
    creationdate: '10/10/2020',
  },
];

export const TeamsPage = () => {
  const [selectedRowKeys, setSelectRowKeys] = React.useState<string[]>([]);
  const onSelectChange = selectedRowKeys => {
    setSelectRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Fragment>
      <p style={{ marginBottom: 50 }}>Manage teams on your workspace</p>

      <div style={{ marginBottom: 40 }}>
        <Button type="primary" icon={<PlusOutlined />}>
          New Team
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
