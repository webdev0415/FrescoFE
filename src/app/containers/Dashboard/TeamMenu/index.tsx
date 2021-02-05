import React, { useEffect, useRef, useState } from 'react';
import StyledContainer from './StyledContainer';
import StyledMenuContainer from './StyledMenuContainer';
import { useParams } from 'react-router-dom';
import { GroupIcon, ChevronLeft } from '../../../../assets/icons';
import ToggleMenu from '../../../components/ToggleMenu';
import { CreateTeamModal } from '../../../components/CreateTeamModal/Loadable';
import { List, Item } from 'app/components/List';
import { actions, reducer, sliceKey } from './slice';
import { teamMenuSaga } from './saga';
import { selectTeamMenu } from './selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { useHistory } from 'react-router-dom';

interface PropsInterface {
  offsetContainerClass: string;
  offsetContainerRef: React.ElementRef<any>;
}
const Team = (props: PropsInterface) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: teamMenuSaga });

  const dispatch = useDispatch();
  const teamMenuSelector = useSelector(selectTeamMenu);
  const params = useParams<any>();

  const { offsetContainerRef } = props;
  const antTabsNavWrapRef = useRef(null);
  const boardsListMenuRef = useRef(null);
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState<Boolean>(false);
  const history = useHistory();

  const [isShowCreateTeamModal, setIsShowCreateTeamModal] = useState<Boolean>(
    false,
  );
  const [teamMenu, setTeamMenu] = useState<any>([]);

  useEffect(() => {
    if (params.orgId) {
      dispatch(
        actions.getTeamMenuRequest({
          orgId: params.orgId,
        }),
      );
    }
  }, [dispatch, params.orgId]);

  useEffect(() => {
    setTeamMenu(teamMenuSelector?.teamMenu);
  }, [teamMenuSelector]);

  const handleCreateNewTeam = (newTeam: any) => {
    const createdTeam = {
      name: newTeam.teamname,
      orgId: params.orgId,
    };
    setTeamMenu(oldTeamMenuArray => [...oldTeamMenuArray, createdTeam]);
    setIsShowCreateTeamModal(false);
  };

  const renderTeams = () => {
    return teamMenu.map(item => (
      <Item
        onClick={() => {
          setIsBoardMenuOpen(false);
          history.push(`/organization/${params.orgId}/team/${item.id}`);
        }}
      >
        {item.name}
      </Item>
    ));
  };

  if (offsetContainerRef.current) {
    antTabsNavWrapRef.current = offsetContainerRef.current.querySelector(
      props.offsetContainerClass,
    );
    return (
      <>
        <StyledContainer onClick={() => setIsBoardMenuOpen(!isBoardMenuOpen)}>
          <GroupIcon />
        </StyledContainer>
        <ToggleMenu
          isOpen={isBoardMenuOpen}
          menuRefObject={boardsListMenuRef}
          offsetContainerRef={antTabsNavWrapRef}
          width={200}
          height={'full'}
          // onOutsideClick={() => setIsBoardMenuOpen(false)}
        >
          <StyledMenuContainer>
            <div className="title" onClick={() => setIsBoardMenuOpen(false)}>
              <ChevronLeft />
              <span>Teams</span>
            </div>
            <List>
              <Item
                disabledItem
                className="space-between"
                onClick={() => setIsShowCreateTeamModal(true)}
              >
                New Team
                <span className="icon">+</span>
              </Item>
              {renderTeams()}
            </List>
          </StyledMenuContainer>
        </ToggleMenu>

        {isShowCreateTeamModal && (
          <CreateTeamModal
            onCancel={() => setIsShowCreateTeamModal(false)}
            onCreateNewTeam={handleCreateNewTeam}
          />
        )}
      </>
    );
  }

  return null;
};

export default Team;
