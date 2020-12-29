import React from 'react';
import '@testing-library/jest-dom';
import '../../../../../__mocks__/matchMedia.mock';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { UserModal } from '..';
import { initialState } from '../../../slice';
import { useSelector } from 'react-redux';

let documentBody: RenderResult;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(() => {
    return {
      id: 'string',
      name: 'string',
      email: 'string',
      role: 'string',
    };
  }),
}));

// (useSelector as jest.Mock).mockImplementation(() => {
//   return {
//     id: 'string',
//     name: 'string',
//     email: 'string',
//     role: 'string',
//   };
// });
describe('<UserModal />', () => {
  beforeEach(() => {
    const props = {
      logOut: jest.fn(),
      showInvite: jest.fn(),
      organization: {
        fName: '',
        lName: '',
      },
    };

    documentBody = render(<UserModal {...props} />);
  });
  it('shows My Organization User Modal ', () => {
    expect(documentBody.getByText('My Organization')).toBeInTheDocument();
  });
  it('shows My Organization User Modal ', () => {
    expect(documentBody.getByTestId('user-email').textContent).toEqual(
      'string',
    );
  });
  it('On Click Logout Called ', () => {
    const node = documentBody.getByTestId('user-logout');
    fireEvent.click(node);
  });
  it('On Click Invite People Called ', () => {
    const node = documentBody.getByTestId('invite-people');
    fireEvent.click(node);
  });
});
