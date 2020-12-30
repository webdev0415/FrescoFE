import React from 'react';
import StyledContainer from './StyledContainer';

interface PropsInterface {
  fullName: string;
}
const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

const UserAvatar = (props: PropsInterface & any) => {
  const { fullName, ...rest } = props;

  return (
    <StyledContainer {...rest}>
      {fullName
        .split(' ')
        .map(n => n[0])
        .join('')}
    </StyledContainer>
  );
};

export default UserAvatar;
