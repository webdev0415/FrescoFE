import React from 'react';
import StyledContainer from './StyledContainer';
import { LogoIcon } from '../../../assets/icons';

interface PropsInterface {
  size?: Number;
  painted?: Boolean;
}

const AppLogo = (props: PropsInterface) => {
  const { size = 56, painted = true } = props;

  return (
    <StyledContainer size={size} painted={painted}>
      <LogoIcon />
    </StyledContainer>
  );
};

export default AppLogo;
