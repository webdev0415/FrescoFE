import ReactDOM from 'react-dom';
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ChatMessage from '../ChatMessage';
import '../../../../../__mocks__/matchMedia.mock';
import { PERMISSION } from 'app/containers/Dashboard';

let documentBody;

describe('<ChatFooter />', () => {
  const root = document.createElement('div');
  const props = {
    id: 1,
    message: '',
    logedUser: {},
    setChatMessages: () => {},
    boardId: 'asdasd',
  };
  ReactDOM.render(<ChatMessage {...props} />, root);
  it('have container', () => {
    expect(root.querySelector('div.chatBox-body-message')).toBeTruthy();
  });
  it('have paragraph for text', () => {
    expect(root.querySelector('p')).toBeTruthy();
  });
});
