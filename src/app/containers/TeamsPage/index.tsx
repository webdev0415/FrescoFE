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
  const token = useSelector(selectToken);
  const params: { orgId?: string } = useParams();
  const { organization } = useWorkspaceContext();
  const orgId = organization.orgId;

  useEffect(() => {
    setTeamMenu(teamMenuSelector?.teamMenu);
  }, [teamMenuSelector]);

  const handleCreateNewTeam = (newTeam: any) => {
    setTeams(oldTeamMenuArray => [...oldTeamMenuArray, newTeam]);
    setIsShowCreateTeamModal(false);
  };

  useEffect(() => {
    if (token && orgId) {
      MembersApiService.getById(organization.orgId).subscribe(
        result => {
          setTeams(result);
        },
        error => {
          console.error(error);
        },
      );
    }
  }, [orgId, organization.orgId, token]);

  const deleteTeam = id => {
    TeamsApiService.deleteById(id).subscribe(
      result => {
        setTeams(teams.filter(team => team.id !== id));
      },
      error => {
        console.error(error);
      },
    );
  };

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
        const owner = members?.users.find(user => user.permission === 'owner');
        return `${owner?.firstName} ${owner?.lastName}`;
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
        if (members.isDefault) {
          return null;
        }
        const button = members?.users?.map((user, index) => {
          if (user.permission === 'owner') {
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
        <Table columns={columns} dataSource={teams} />
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
