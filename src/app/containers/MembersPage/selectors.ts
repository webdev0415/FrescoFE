import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.workspaceMembers || initialState;

export const selectWorkspaceMembers = createSelector(
  [selectDomain],
  workspaceMembersState => workspaceMembersState,
);
