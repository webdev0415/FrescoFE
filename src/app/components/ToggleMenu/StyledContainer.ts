import styled from 'styled-components';

interface PropsInterface {
  width: Number;
  height: Number | String;
  isOpen: Boolean;
  endPosition: any;
}

export default styled.div<PropsInterface>`
  position: fixed;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) =>
    `${typeof height === 'string' ? '100vh' : `${height}px`}`};
  z-index: ${({ isOpen }) => (isOpen ? '1000' : '-1000')};
  background-color: white;

  /* display: ${({ isOpen }) => (isOpen ? 'block' : 'none')}; */
  top: ${({ endPosition }) => `${endPosition.top}`}px;
  left: ${({ endPosition }) => `${endPosition.left}`}px;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: opacity .2s ease-in-out;
`;
