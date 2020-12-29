import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { ChatFooter } from '../ChatFooter';
import '../../../../../__mocks__/matchMedia.mock';
import { act } from 'react-dom/test-utils';

let documentBody: RenderResult;

describe('<ChatFooter />', () => {
  beforeEach(() => {
    act(() => {
      const props = {
        boardId: 'board-id',
        user: jest.fn(),
        setChatMessages: jest.fn(),
        scroll: null,
      };
      documentBody = render(<ChatFooter {...props} />);
    });
  });

  it('have action button', () => {
    expect(documentBody.getByRole('button')).toBeTruthy();
  });
  it('have text are', () => {
    expect(documentBody.getByRole('input-message')).toBeTruthy();
  });
  it('have text Changed', () => {
    const node = documentBody.getByRole('input-message');
    fireEvent.change(node, { target: { value: '$23.0' } });
  });

  it('have action Clicked', () => {
    const button = documentBody.getByRole('button');
    fireEvent.click(button);
  });
});
