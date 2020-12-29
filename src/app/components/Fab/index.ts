import styled from 'styled-components';

interface PropsInterface {
  size: Number;
}

export default styled.button<PropsInterface>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  outline: 0;
  border-radius: 50%;
  outline: 0;
  background: white;
  border: none;
`;
