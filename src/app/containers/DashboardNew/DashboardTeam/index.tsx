/**
 *
 * Dashboard
 *
 */
import React, { memo, useEffect, useState } from 'react';
import { TeamsApiService } from '../../../../services/APIService/TeamsApi.service';
import { TeamInterface } from '../../../../services/APIService/interfaces/Team.interface';
import { BoardList } from '../../BoardList';
import { useParams } from 'react-router-dom';
import { Breadcrumb, Button, Divider } from 'antd';
import { CanvasBoardTemplates } from '../../../components/CanvasBoardTemplates';
import {
  PlusOutlined,
  HomeOutlined,
  UserOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import add_user from '../../../../assets/images/add_user.svg';
import Avatar from '../../../components/Avatar';
import { UpdateTeamMembersModal } from '../../../components/UpdateTeamMembersModal/Loadable';

interface Props {
  match?: any;
  location?: any;
}

export const DashboardTeam = memo((props: Props) => {
  const [showAddNewBoard, setAddNewBoard] = useState(false);
  const [
    isShowUpdateTeamMembersModal,
    setIsShowUpdateTeamMembersModal,
  ] = useState<Boolean>(false);
  const [team, setTeam] = useState<TeamInterface>();
  const params = useParams();
  const { match } = props;
  const teamId = match.params.teamId;
  const orgId = match.params.orgId;

  useEffect(() => {
    if (teamId) {
      TeamsApiService.getById(teamId).subscribe(
        data => {
          setTeam(data);
        },
        error => {
          console.error(error.data.response);
        },
      );
    }
  }, [teamId]);

  const handleUpdateTeam = (team: TeamInterface) => {
    setTeam(team);
    setIsShowUpdateTeamMembersModal(false);
  };

  const renderUsersAvatars = u => {
    if (u.length <= 3) {
      return u.map(user => (
        <Avatar
          className="oval"
          fullName={user.firstName + ' ' + user.lastName}
          avatar={user.avatar}
          style={{
            width: 34,
            height: 34,
          }}
        />
      ));
    }

    return u.splice(0, 3).map(user => (
      <>
        <Avatar
          fullName={user.firstName + ' ' + user.lastName}
          avatar={user.avatar}
          className="oval"
          style={{
            width: 34,
            height: 34,
          }}
        />
        s
      </>
    ));
  };

  return (
    <>
      {!!team && showAddNewBoard ? (
        <>
          <Breadcrumb>
            <Breadcrumb.Item>
              <span>Teams</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{team.name}</Breadcrumb.Item>
          </Breadcrumb>
          <CanvasBoardTemplates
            orgId={orgId}
            teamId={teamId}
            onClose={() => setAddNewBoard(false)}
          />
        </>
      ) : (
        <div className="card-section">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddNewBoard(true)}
          >
            New Board
          </Button>
          <div className="card-section-avatars">
            <div className="canvas-collaborators">
              {team && team.users && team.users.length > 0 ? (
                renderUsersAvatars(team.users)
              ) : (
                <></>
              )}
            </div>
            {team && team.users && team.users.length > 3 && (
              <span className="users-count">{team.users.length - 1}+</span>
            )}
            <Divider type="vertical" />
            <img
              className="add-user-image"
              onClick={() => setIsShowUpdateTeamMembersModal(true)}
              src={add_user}
            />
          </div>
          <div style={{ paddingTop: 30 }}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <span>Teams</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{team?.name}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div style={{ paddingTop: 30 }}>
            {orgId && <BoardList orgId={orgId} teamId={teamId} />}
          </div>
        </div>
      )}

      {isShowUpdateTeamMembersModal && (
        <UpdateTeamMembersModal
          team={team}
          onCancel={() => setIsShowUpdateTeamMembersModal(false)}
          onUpdateTeam={handleUpdateTeam}
        />
      )}
    </>
  );
});
