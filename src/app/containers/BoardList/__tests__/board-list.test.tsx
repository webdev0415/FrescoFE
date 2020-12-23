import React from 'react';
import '@testing-library/jest-dom';
import '../../../../../__mocks__/matchMedia.mock';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { BoardList } from '..';
import { useSelector } from 'react-redux';

let documentBody: RenderResult;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation(() => {
    return {
      loading: false,
      boardList: [
        {
          id: 'string',
          createdUserId: 'string',
          path: 'string',
          users: [],
          name: 'string',
          orgId: 'string',
          categoryId: 'string',
          data: 'string',
          imageId: 'string',
        },
      ],
    };
  }),
}));
describe('<BoardList />', () => {
  beforeEach(() => {
    const props = {
      orgId: '',
    };

    documentBody = render(<BoardList {...props} />);
  });

  // it('On Click Delete Menu Called ', () => {
  //   const node = documentBody.getByRole('delete-menu');
  //   fireEvent.click(node);
  // });
  // it('On Click Rename Menu Called ', () => {
  //   const node = documentBody.getByRole('rename-menu');
  //   fireEvent.click(node);
  // });
});
