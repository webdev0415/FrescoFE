import React, { useRef, useState } from 'react';
import StyledContainer from './StyledContainer';
import StyledMenuContainer from './StyledMenuContainer';
import { GroupIcon, ChevronLeft } from '../../../../assets/icons';
import ToggleMenu from '../../../components/ToggleMenu';
import { List, Item } from 'app/components/List';

interface PropsInterface {
  offsetContainerRef: React.ElementRef<any>;
}
const Team = (props: PropsInterface) => {
  const { offsetContainerRef } = props;
  const antTabsNavWrapRef = useRef(null);
  const boardsListMenuRef = useRef(null);
  const boardDetailedMenuRef = useRef(null);
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState<Boolean>(false);

  if (offsetContainerRef.current) {
    antTabsNavWrapRef.current = offsetContainerRef.current.querySelector(
      '.ant-tabs-nav-wrap',
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
          onOutsideClick={() => setIsBoardMenuOpen(false)}
        >
          <StyledMenuContainer>
            <div className="title" onClick={() => setIsBoardMenuOpen(false)}>
              <ChevronLeft />
              <span>Teams</span>
            </div>
            <List>
              <Item disabledItem className="space-between">
                New Team
                <span className="icon">+</span>
              </Item>
              <Item activeItem>Design</Item>
              <Item>Business</Item>
              <Item>Developers</Item>
            </List>
          </StyledMenuContainer>
        </ToggleMenu>
      </>
    );
  }

  return null;
};

export default Team;
