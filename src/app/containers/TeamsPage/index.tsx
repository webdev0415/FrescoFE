import React, { Fragment, useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.less';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'app/selectors';
import { useParams } from 'react-router-dom';
import { actions, reducer, sliceKey } from '../Dashboard/TeamMenu/slice';
import { selectTeamMenu } from '../Dashboard/TeamMenu/selectors';
import { useWorkspacesContext } from 'context/workspaces';
import { useWorkspaceContext } from 'context/workspace';

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
  const [teamMenu, setTeamMenu] = useState<any>([]);

  const [selectedRowKeys, setSelectRowKeys] = React.useState<string[]>([]);
  const onSelectChange = selectedRowKeys => {
    setSelectRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const teamMenuSelector = useSelector(selectTeamMenu);
  const params: { orgId?: string } = useParams();
  const { organization } = useWorkspaceContext();
  const orgId = organization.orgId;

  useEffect(() => {
    console.log(organization.orgId);
    if (token && orgId) {
      dispatch(
        actions.getTeamMenuRequest({
          token,
          orgId,
        }),
      );
    }
  }, [dispatch, orgId, organization.orgId, token]);

  useEffect(() => {
    setTeamMenu(teamMenuSelector?.teamMenu);
    console.log(teamMenu);
  }, [teamMenu, teamMenuSelector]);
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
