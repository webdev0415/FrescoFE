import { createPortal } from 'react-dom';
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import StyledContainer from './StyledContainer';
import useOutsideClickHandler from '../../../customHooks/useOnClickOutside';

interface PropsInterface {
  offsetContainerRef: React.ElementRef<any>;
  menuRefObject: React.ElementRef<any>;
  isOpen: Boolean;
  width: Number;
  ignoredContainers?: React.ElementRef<any>[];
  height: Number | 'full';
  children: React.ReactChild;
  equalize?: 'bottom' | 'top';
  name?: string;
  onOutsideClick?: () => void;
}

interface PositionStateInterface {
  top: Number;
  left: Number;
}

const ToggleMenu = (props: PropsInterface) => {
  const [endPosition, setEndPosition] = useState<PositionStateInterface>({
    top: 0,
    left: 0,
  });
  const {
    offsetContainerRef,
    width,
    height,
    children,
    isOpen,
    equalize,
    ignoredContainers = [],
    menuRefObject,
    onOutsideClick = () => {},
  } = props;

  useOutsideClickHandler([menuRefObject, ...ignoredContainers], () => {
    if (isOpen) {
      onOutsideClick();
    }
  });

  const calcEndPosition = containerElement => {
    const offsetLeft =
      containerElement.offsetLeft + containerElement.clientWidth;
    let top = 0;
    let left = 0;
    switch (equalize) {
      case 'top':
        left = offsetLeft;
        break;
      case 'bottom':
        if (typeof height === 'number') {
          top = document.body.clientHeight - height;
        }
        left = offsetLeft;
        break;
      default:
        top = containerElement.offsetTop;
        left = containerElement.offsetLeft + containerElement.clientWidth;
        break;
    }
    setEndPosition({ top, left });
  };

  useEffect(() => {
    calcEndPosition(offsetContainerRef.current);
  }, [isOpen]);

  return createPortal(
    <StyledContainer
      isOpen={isOpen}
      ref={menuRefObject}
      className="toggle-menu"
      width={width}
      height={height}
      endPosition={endPosition}
    >
      {children}
    </StyledContainer>,
    document.querySelector('body')!,
  );
};

export default ToggleMenu;
