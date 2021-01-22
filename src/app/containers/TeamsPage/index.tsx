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
import axios from 'axios';
import moment from 'moment';
import { CreateTeamModal } from '../../components/CreateTeamModal/Loadable';
import { MembersApiService } from '../../../services/APIService/MembersApi.service';
import { TeamsApiService } from '../../../services/APIService/TeamsApi.service';

const columns = [
  {
    title: 'Team Name',
    dataIndex: 'name',
  },
  {
    key: 'key',
    dataIndex: 'key',
  },
  {
    title: 'Members',
    dataIndex: 'users',
    render: users => <p>{users?.length}</p>,
  },
  {
    title: 'Created by',
    dataIndex: 'createdby',
    render: (all, members, b) => {
      const name = members?.users?.map((user, index) => {
        if (user.permission == 'owner') {
          return <p>{user.name}</p>;
        }
      });
      return <p>{name}</p>;
    },
  },
  {
    title: 'Creation date',
    dataIndex: 'createdAt',
    render: createdAt => <p>{moment(createdAt).format('MM/DD/YYYY')}</p>,
  },
  {
    title: 'Delete',
    render: (all, members, b) => {
      const button = members?.users?.map((user, index) => {
        if (user.permission == 'owner') {
          return (
            <Button danger onClick={() => deleteTeam(all.id)}>
              {' '}
              Delete
            </Button>
          );
        }
      });
      return <p>{button}</p>;
    },
  },
];

const deleteTeam = id => {
  TeamsApiService.getById(id).subscribe(
    result => {
      console.log(result);
    },
    error => {
      console.error(error);
    },
  );
};

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
  const [teams, setTeams] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectRowKeys] = React.useState<string[]>([]);
  const onSelectChange = selectedRowKeys => {
    setSelectRowKeys(selectedRowKeys);
  };
  const [teamMenu, setTeamMenu] = useState<any>([]);

  const [isShowCreateTeamModal, setIsShowCreateTeamModal] = useState(false);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const teamMenuSelector = useSelector(selectTeamMenu);

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const params: { orgId?: string } = useParams();
  const { organization } = useWorkspaceContext();
  const orgId = organization.orgId;

  useEffect(() => {
    setTeamMenu(teamMenuSelector?.teamMenu);
  }, [teamMenuSelector]);

  const handleCreateNewTeam = (newTeam: any) => {
    const createdTeam = {
      name: newTeam.teamname,
      orgId: orgId,
    };
    setTeamMenu(oldTeamMenuArray => [...oldTeamMenuArray, createdTeam]);

    setIsShowCreateTeamModal(false);
  };

  useEffect(() => {
    console.log(organization.orgId);
    if (token && orgId) {
      MembersApiService.getById(organization.orgId).subscribe(
        result => {
          console.log(result);
          setTeams(result);
        },
        error => {
          console.error(error);
        },
      );
    }
  }, [orgId, organization.orgId, token]);

  return (
    <Fragment>
      <p style={{ marginBottom: 50 }}>Manage teams on your workspace</p>

      <div style={{ marginBottom: 40 }}>
        <Button
          type="primary"
          onClick={() => setIsShowCreateTeamModal(true)}
          icon={<PlusOutlined />}
        >
          New Team
        </Button>
      </div>

      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={teams}
        />
        {isShowCreateTeamModal && (
          <CreateTeamModal
            onCancel={() => setIsShowCreateTeamModal(false)}
            onCreateNewTeam={handleCreateNewTeam}
          />
        )}
      </div>
    </Fragment>
  );
};
