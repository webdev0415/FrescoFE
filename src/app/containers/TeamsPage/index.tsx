import React, { Fragment, useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.less';
import { useSelector } from 'react-redux';
import { selectToken } from 'app/selectors';
import { useWorkspaceContext } from 'context/workspace';
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

export const TeamsPage = () => {
  const [teams, setTeams] = useState<any>([]);
  const [selectedRowKeys, setSelectRowKeys] = React.useState<string[]>([]);
  const onSelectChange = selectedRowKeys => {
    setSelectRowKeys(selectedRowKeys);
  };

  const [isShowCreateTeamModal, setIsShowCreateTeamModal] = useState(false);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const token = useSelector(selectToken);
  const { organization } = useWorkspaceContext();
  const orgId = organization.orgId;

  const handleCreateNewTeam = (newTeam: any) => {
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
