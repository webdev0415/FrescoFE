import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ChatHeader } from '../ChatHeader';
import '../../../../../__mocks__/matchMedia.mock';
import { PERMISSION } from 'app/containers/Dashboard';

let documentBody;

describe('<ChatHeader />', () => {
  beforeEach(() => {
    const props = {
      hide: jest.fn(),
    };

    documentBody = render(<ChatHeader {...props} />);
  });
  it('have element by text Live Chat', () => {
    expect(documentBody.getByText('Live Chat')).toBeInTheDocument();
  });
  it('have action button', () => {
    expect(documentBody.getByRole('button')).toBeInTheDocument();
  });
});
