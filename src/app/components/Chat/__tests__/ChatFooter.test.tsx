import ReactDOM from 'react-dom';
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ChatFooter } from '../ChatFooter';
import '../../../../../__mocks__/matchMedia.mock';
import { PERMISSION } from 'app/containers/Dashboard';

let documentBody;

describe('<ChatFooter />', () => {
  const root = document.createElement('div');
  const props = {
    boardId: 'board-id',
    user: jest.fn(),
    setChatMessages: jest.fn(),
    scroll: null,
  };
  ReactDOM.render(<ChatFooter {...props} />, root);
  it('have action button', () => {
    expect(root.querySelector('button')).toBeTruthy();
  });
  it('have text are', () => {
    expect(root.querySelector('input')).toBeTruthy();
  });
});
