import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { CanvasBoardTemplates } from '..';

jest.mock('../../../../services/APIService/http-instance');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    location: {
      pathname: '/auth/login',
    },
    listen: jest.fn(),
  }),
}));

let documentBody: RenderResult;

describe('<CanvasBoardTemplates />', () => {
  beforeEach(() => {
    documentBody = render(
      <CanvasBoardTemplates orgId="12" onClose={jest.fn()} />,
    );
  });
  it('CanvasBoardTemplates Render Test', () => {
    expect(documentBody.getByText('Cancel')).toBeInTheDocument();
  });
  it(' Click Event', () => {
    const node = documentBody.getByText('Cancel');
    fireEvent.click(node);
  });
});
