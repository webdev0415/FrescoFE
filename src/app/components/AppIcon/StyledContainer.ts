import styled from 'styled-components';

interface PropsInterface {
  size: Number;
  painted: Boolean;
}

export default styled.div<PropsInterface>`
  cursor: default;
  width: ${({ size }) => size.toString()}px;
  height: ${({ size }) => size.toString()}px;
  ${({ painted }) => {
    if (painted) {
      return `background-color: #9646f5;`;
    }
    return '';
  }}
  text-align: center;
  line-height: ${({ size }) => size.toString()}px;
`;
