import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { Collaboration } from '..';

describe('<Collaboration />', () => {
  it('Snapshot Test', () => {
    let documentBody = render(<Collaboration users={[{ email: 'abc' }]} />);
    expect(documentBody).toMatchSnapshot();
  });

  it('Roles Test Test', () => {
    let documentBody = render(<Collaboration users={[{ email: 'abc' }]} />);
    expect(documentBody.getByRole('users').textContent).toBeTruthy();
  });

  it('Roles Test Test', () => {
    let documentBody = render(<Collaboration users={undefined} />);
    expect(documentBody.getByRole('users').textContent).toEqual('');
  });
});
