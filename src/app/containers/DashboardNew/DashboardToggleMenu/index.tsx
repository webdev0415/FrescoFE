import ToggleMenu from '../../../components/ToggleMenu';
import Fab from '../../../components/Fab';
import arrowSvg from '../../../../assets/icons/arrow.svg';
import { Item, List } from '../../../components/List';
import {
  AddPerson,
  Billing,
  Logout,
  Person,
  QuestionMark,
  Teams,
  Workspace,
} from '../../../../assets/icons';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Avatar from '../../../components/Avatar';
import { InviteMemberModal } from '../../../components/InviteMemberModal/Loadable';
import { MyProfileModal } from '../../../components/MyProfileModal/Loadable';
import { TeamMembersModal } from '../../../components/TeamMembersModal/Loadable';
import { CreateWorkspaceModal } from '../../../components/CreateWorkspaceModal/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { selectDashboard } from '../selectors';
import { actions, reducer, sliceKey } from '../slice';
import { selectToken, selectUser } from '../../../selectors';
import {
  useInjectReducer,
  useInjectSaga,
} from '../../../../utils/redux-injectors';
import { dashboardSaga } from '../saga';

const PERMISSION = {
  EDITOR: 'editor',
  VIEW: 'view',
};

const TeamsToggleMenuStyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #e9e9e9;
  align-items: center;
  padding: 10px 0;
`;

const StyledBoardDetailedToggleMenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  .divided {
    margin-bottom: 10px;
    padding-bottom: 10px;
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border-bottom: 1px solid #dad7d7;
  }
  .title {
    display: flex;
    align-items: center;
    flex: 1;
    padding-left: 20px;
    padding-right: 20px;
  }
  ul {
    flex: 5;
  }
  .logout {
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 20px;
    svg {
      margin-right: 10px;
    }
  }
`;

const StyledBoardFeaturesContainer = styled.div`
  padding: 16px;
  border-left: 1px solid #dcd4d4;
  height: 100%;
`;

const DashboardToggleMenu = (props: any) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardSaga });
  const {
    orgId,
    organizations,
    gotoWorkspaceSettingsBillingsPage,
    gotoWorkspaceSettingsPage,
    gotoWorkspaceSettingsTeamsPage,
    handleLogOut,
    organization,
    setOrganizations,
    setOrganization,
    history,
    tabsContainerRef,
  } = props;

  const [isTeamMenuOpen, setIsToggleMenuOpen] = useState<Boolean>(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState(PERMISSION.EDITOR);
  const [isShowInvitationModal, setIsShowInvitationModal] = useState(false);
  const [isShowMyProfileModal, setIsShowMyProfileModal] = useState(false);
  const [isShowTeamMembersModal, setIsShowTeamMembersModal] = useState(false);
  const [invitePeopleToggleMenu, setInvitePeopleToggleMenu] = useState<Boolean>(
    false,
  );
  const [
    isShowWorkspaceCreatingModal,
    setIsShowWorkspaceCreatingModal,
  ] = useState(false);
  const profileToggleMenuRef = useRef<any>(null);
  const teamDetailedMenuRef = useRef<any>(null);
  const invitePeopleToggleMenuRef = useRef<any>(null);

  const dashboard = useSelector(selectDashboard);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!dashboard.linkInvitation) {
      setEmail('');
      setIsShowInvitationModal(false);
    }
  }, [dashboard]);

  const showInviteModal = () => {
    setIsShowInvitationModal(true);
  };
  const showMyProfileModal = () => {
    setIsShowMyProfileModal(true);
  };
  const showTeamMembersModal = () => {
    setIsShowTeamMembersModal(true);
  };

  const renderWorkspaces = () => {
    return organizations.length > 0 ? (
      organizations.map((item, key) => (
        <Avatar
          imgClassName={orgId === item.orgId ? 'active' : ''}
          style={{
            marginBottom: 10,
            border: orgId === item.orgId ? '2px solid #b773ff' : 'none',
          }}
          avatar={item.organizationAvatar}
          fullName={item.organizationName}
          key={key}
          onClick={() => handleSelectWorkspace(item)}
        />
      ))
    ) : (
      <></>
    );
  };

  const handleSelectWorkspace = (workspace: any) => {
    setOrganization(workspace);
    history.push(`/organization/${workspace.orgId}`);
  };

  const handleSearch = (value: string) => {
    dispatch(
      actions.searchEmailRequest({ data: { email: value, orgId }, token }),
    );
  };

  const _handleSelectEmail = value => {
    setEmail(value);
  };

  const _handleChangePermission = value => {
    setPermission(value);
  };

  const _handleInvitation = () => {
    const itemEmail = dashboard.listEmail?.filter(item => item.email === email);
    if (itemEmail.length) {
      dispatch(
        actions.invitationRequest({
          data: itemEmail,
          permission,
          token,
          history,
          orgId,
        }),
      );
    } else {
      dispatch(
        actions.invitationRequest({
          data: { email },
          permission,
          token,
          history,
          orgId,
        }),
      );
    }
  };

  const handleCreateWorkspace = (workspaceName: any) => {
    const organization = {
      organizationName: workspaceName,
    };
    setOrganizations(items => [...items, organizations]);
    setIsShowWorkspaceCreatingModal(false);
  };

  const handleUpdateProfile = (profile: any) => {
    setIsShowMyProfileModal(false);
  };

  let userFullName = '';
  if (user) {
    userFullName = user.firstName + ' ' + user.lastName;
  }

  const showWorkspaceSettings = workspace => {
    if (workspace.permission === 'owner' || workspace.permission === 'admin') {
      setInvitePeopleToggleMenu(true);
    }
  };

  //if (tabsContainerRef.current) {
  return (
    <>
      <div onClick={() => setIsToggleMenuOpen(!isTeamMenuOpen)}>
        {userFullName && (
          <Avatar
            fullName={userFullName}
            avatar={user?.avatar}
            style={{
              width: 34,
              height: 34,
            }}
          />
        )}

        <Avatar
          fullName={organization.organizationName}
          avatar={organization.organizationAvatar}
          style={{
            width: 25,
            height: 25,
            fontSize: 12,
            position: 'relative',
            bottom: 8,
          }}
        />
      </div>
      <ToggleMenu
        width={56}
        height={350}
        isOpen={isTeamMenuOpen}
        menuRefObject={profileToggleMenuRef}
        offsetContainerRef={{
          current: tabsContainerRef.current.querySelector('.left-sidebar'),
        }}
        ignoredContainers={[teamDetailedMenuRef, invitePeopleToggleMenuRef]}
        equalize="bottom"
        onOutsideClick={() => setIsToggleMenuOpen(false)}
      >
        <TeamsToggleMenuStyledContainer>
          <div>{renderWorkspaces()}</div>
          <Fab size={35} onClick={() => setIsShowWorkspaceCreatingModal(true)}>
            +
          </Fab>
        </TeamsToggleMenuStyledContainer>
      </ToggleMenu>
      <ToggleMenu
        width={264}
        height={350}
        isOpen={isTeamMenuOpen}
        menuRefObject={teamDetailedMenuRef}
        offsetContainerRef={profileToggleMenuRef}
        ignoredContainers={[invitePeopleToggleMenuRef]}
        equalize="bottom"
        /*onOutsideClick={() => {
          setIsTeamDetailedMenuOpen(false);
          setInvitePeopleToggleMenu(false);
        }}*/
      >
        <StyledBoardDetailedToggleMenuContainer>
          <div
            className="title divided"
            onClick={() => showWorkspaceSettings(organization)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{organization.organizationName}</div>
            <div>
              {(organization.permission === 'owner' ||
                organization.permission === 'admin') && <img src={arrowSvg} />}
            </div>
          </div>
          <List className="divided">
            <Item onClick={showMyProfileModal}>
              <span className="icon">
                <Person />
              </span>
              My Profile
            </Item>
            <Item>
              <span className="icon">
                <QuestionMark />
              </span>
              Help
            </Item>
          </List>
          <div className="logout" onClick={() => handleLogOut()}>
            <Logout />
            Log out
          </div>
        </StyledBoardDetailedToggleMenuContainer>
      </ToggleMenu>
      <ToggleMenu
        width={264}
        height={350}
        isOpen={invitePeopleToggleMenu}
        menuRefObject={invitePeopleToggleMenuRef}
        offsetContainerRef={teamDetailedMenuRef}
        equalize="bottom"
        name="idiot variant"
        onOutsideClick={() => setInvitePeopleToggleMenu(false)}
      >
        <StyledBoardFeaturesContainer>
          <List className="divided">
            <Item onClick={showInviteModal}>
              <span className="icon">
                <AddPerson />
              </span>
              Invite people
            </Item>
          </List>
          <List className="divided">
            <Item onClick={() => gotoWorkspaceSettingsPage(organization)}>
              <span className="icon">
                <Workspace />
              </span>
              Workspace
            </Item>
            <Item onClick={showTeamMembersModal}>
              <span className="icon">
                <Person />
              </span>
              Members
            </Item>
            <Item onClick={() => gotoWorkspaceSettingsTeamsPage(organization)}>
              <span className="icon">
                <Teams />
              </span>
              Teams
            </Item>
            <Item
              onClick={() => gotoWorkspaceSettingsBillingsPage(organization)}
            >
              <span className="icon">
                <Billing />
              </span>
              Billing
            </Item>
          </List>
        </StyledBoardFeaturesContainer>
      </ToggleMenu>

      {isShowInvitationModal && (
        <InviteMemberModal
          onCancel={() => setIsShowInvitationModal(false)}
          handleInvitation={_handleInvitation}
          listEmail={dashboard.listEmail}
          email={email}
          loading={dashboard.loading}
          handleSearch={handleSearch}
          handleSelectEmail={_handleSelectEmail}
          handleChangePermission={_handleChangePermission}
        />
      )}
      {isShowMyProfileModal && (
        <MyProfileModal
          onCancel={() => setIsShowMyProfileModal(false)}
          loading={dashboard.loading}
          useremail={user && user.email}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
      {isShowTeamMembersModal && (
        <TeamMembersModal
          onCancel={() => setIsShowTeamMembersModal(false)}
          loading={dashboard.loading}
        />
      )}
      {isShowWorkspaceCreatingModal && (
        <CreateWorkspaceModal
          onCancel={() => setIsShowWorkspaceCreatingModal(false)}
          onCreateWorkspace={handleCreateWorkspace}
        />
      )}
    </>
  );
  //}
};

export default DashboardToggleMenu;
