import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { CanvasBoardTemplates } from '..';
import { act } from 'react-dom/test-utils';
import { Observable } from 'rxjs';
import {
  BoardApiService,
  BoardInterface,
  CanvasCategoryInterface,
  CanvasCategoryService,
  http,
} from '../../../../services/APIService';
import { AxiosRequestConfig } from 'axios';

jest.mock('../../../../services/APIService/http-instance');

// jest.spyOn(BoardApiService, 'getByOrganizationId').mockImplementation(() => {
//   return new Observable<BoardInterface[]>(subscriber => {
//     subscriber.next([
//       {
//         id: 'string',
//         createdUserId: 'string',
//         path: 'string',
//         users: [],
//         name: 'string',
//         categoryId: 'string',
//         data: 'string',
//         imageId: 'string',
//         orgId: 'string',
//       },
//     ]);
//   });
// });
//
// jest.spyOn(CanvasCategoryService, 'list').mockImplementation(() => {
//   return new Observable<CanvasCategoryInterface[]>(subscriber => {
//     subscriber.next([
//       {
//         id: 'string',
//         name: 'string',
//       },
//     ]);
//     subscriber.complete();
//   });
// });

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
    (http.request as jest.Mock).mockImplementationOnce(
      (config: AxiosRequestConfig) => {
        switch (config.url) {
          case '/category':
            return Promise.resolve({
              data: [
                {
                  id: 'string',
                  name: 'string',
                },
              ],
            });
          case 'canvas/organization/string':
            return Promise.resolve({
              data: [
                {
                  id: 'string',
                  createdUserId: 'string',
                  path: 'string',
                  users: [],
                  name: 'string',
                  categoryId: 'string',
                  data: 'string',
                  imageId: 'string',
                  orgId: 'string',
                },
              ],
            });
          default:
            return Promise.reject(new Error('not found'));
        }
      },
    );
    act(() => {
      documentBody = render(
        <CanvasBoardTemplates orgId="12" onClose={jest.fn()} />,
      );
    });
  });
  it('CanvasBoardTemplates Render Test', () => {
    act(() => {
      expect(documentBody.getByText('Cancel')).toBeInTheDocument();
    });
  });
  // it(' Click Event', () => {
  //   act(() => {
  //     console.log(documentBody);
  //     const node = documentBody.getByText('Select');
  //     fireEvent.click(node);
  //   });
  // });
});
