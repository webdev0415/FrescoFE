import styled from 'styled-components';

interface PropsInterface {
  disabledItem?: Boolean;
  activeItem?: Boolean;
}

export default styled.li<PropsInterface>`
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  margin-bottom: 16px;
  padding-left: 16px;
  cursor: pointer;
  .icon {
    padding-right: 10px;
    font-size: 20px;
  }
  &.space-between {
    justify-content: space-between;
  }
  ${props => {
    if (props.activeItem) {
      return `
        background-color: white;
        &::before {
          content: "";
          position: absolute;
          width: 4px;
          height: 100%;
          left: 0;
          background-color: #9646f5;
        }
      `;
    }
    if (props.disabledItem) {
      return `
        color: #9b9b9b;
      `;
    }
  }}
`;
