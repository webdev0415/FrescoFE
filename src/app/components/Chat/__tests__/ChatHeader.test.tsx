import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ChatHeader } from '../ChatHeader';
import '../../../../../__mocks__/matchMedia.mock';

describe('<ChatHeader />', () => {
  const props = {
    hide: jest.fn(),
  };
  const root = document.createElement('div');
  ReactDOM.render(<ChatHeader {...props} />, root);
  it('have action button', () => {
    expect(root.querySelector('button')).toBeTruthy();
  });
});
