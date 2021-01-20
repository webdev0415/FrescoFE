import React from 'react';
import StyledContainer from './StyledContainer';

interface PropsInterface {
  fullName: string;
}
const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

const UserAvatar = (props: PropsInterface & any) => {
  const { fullName, ...rest } = props;
  console.log("fullName", fullName, "kkk", fullName
            .split(' ')
            .map(n => n[0])
            .join(''))
  return (
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
