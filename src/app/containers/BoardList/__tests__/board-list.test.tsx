import React from 'react';
import '@testing-library/jest-dom';
import '../../../../../__mocks__/matchMedia.mock';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { BoardList } from '..';
import { Provider } from 'react-redux';
import { configureAppStore } from '../../../../store/configureStore';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

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
    const initialState = {};
    const store = configureAppStore();
    store.dispatch = jest.fn();

    documentBody = render(
      <Provider store={store}>
        <BrowserRouter>
          <BoardList {...props} />
        </BrowserRouter>
      </Provider>,
    );
  });

  it('On Click Delete Menu Called ', () => {
    let actionButton;
    const node = documentBody.getByRole('cart-action');
    act(() => {
      actionButton = node.querySelector('.action-button');
      expect(actionButton).toBeDefined();
      fireEvent.click(actionButton);
    });

    act(() => {
      const deleteButton = documentBody.getByRole('delete-menu');
      fireEvent.click(deleteButton);
    });
    act(() => {
      const renameButton = documentBody.getByRole('rename-menu');
      fireEvent.click(renameButton);
    });
  });

  // it('On Click Rename Menu Called ', () => {
  //   let actionButton;
  //   const node = documentBody.getByRole('cart-action');
  //   act(() => {
  //     actionButton = node.querySelector('.action-button');
  //     expect(actionButton).toBeDefined();
  //     fireEvent.click(actionButton);
  //   });
  //   act(() => {
  //     const renameButton = documentBody.getByRole('rename-menu');
  //     fireEvent.click(renameButton);
  //   });
  // });
});
