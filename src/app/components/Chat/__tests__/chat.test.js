import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ChatHeader } from '../ChatHeader';
import '../../../../../__mocks__/matchMedia.mock';
import { PERMISSION } from 'app/containers/Dashboard';

let documentBody;

describe('<InviteMemberModal />', () => {
  beforeEach(() => {
    const props = {
      hide: jest.fn(),
    };

    documentBody = render(<ChatHeader {...props} />);
  });
  it('button in', () => {
    expect(documentBody).getByText('').toBeInTheDocument();
  });
  it('img in', () => {
    expect(documentBody.getByText('img')).toBeInTheDocument();
  });
  it('chatBox', () => {
    expect(documentBody.getByText('chatBox')).toBeInTheDocument();
  });
});
