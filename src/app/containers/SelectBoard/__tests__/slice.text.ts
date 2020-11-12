import * as slice from '../slice';
import { ContainerState } from '../types';

describe('main file slice slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should handle selectBoardRequest', () => {
    expect(
      slice.reducer(state, slice.actions.selectBoardRequest('orgId')),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: true,
    });
  });

  it('should handle selectBoardRequestSuccess', () => {
    expect(
      slice.reducer(state, slice.actions.selectBoardRequestSuccess({})),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: false,
    });
  });

  it('should handle selectBoardRequestError', () => {
    expect(
      slice.reducer(state, slice.actions.selectBoardRequestError()),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: false,
    });
  });
});
