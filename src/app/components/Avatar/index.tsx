import React from 'react';
import StyledContainer from './StyledContainer';

interface PropsInterface {
  fullName: string;
  avatar?: string;
  imgClassName?: string;
}
const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

const UserAvatar = (props: PropsInterface & any) => {
  const { fullName, avatar, imgClassName, ...rest } = props;

  return !!avatar ? (
    <StyledContainer {...rest}>
      <img
        className={imgClassName}
        style={{ borderRadius: '50%', width: '100%', height: '100%' }}
        src={avatar}
      />
    </StyledContainer>
  ) : (
    <StyledContainer {...rest}>
      {fullName?.split(' ').length >= 2
        ? fullName
            .split(' ')
            .map(n => n[0])
            .join('')
        : fullName?.slice(0, 1).toUpperCase()}
      {/* {fullName} */}
    </StyledContainer>
  );
};

export default UserAvatar;
