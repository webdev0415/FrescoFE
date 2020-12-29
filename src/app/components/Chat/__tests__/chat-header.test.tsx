import React from 'react';
import '@testing-library/jest-dom';
import { ChatHeader } from '../ChatHeader';
import '../../../../../__mocks__/matchMedia.mock';
import { fireEvent, render, RenderResult } from '@testing-library/react';

let documentBody: RenderResult;
describe('<ChatHeader />', () => {
  beforeEach(() => {
    documentBody = render(<ChatHeader hide={jest.fn()} />);
  });

  it('have action Clicked', () => {
    const button = documentBody.getByRole('button');
    fireEvent.click(button);
  });
});
