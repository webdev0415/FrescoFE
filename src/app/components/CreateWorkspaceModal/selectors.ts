import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.createWorkspace || initialState;

export const selectCreateWorkspace = createSelector(
  [selectDomain],
  createWorkspaceState => createWorkspaceState,
);
