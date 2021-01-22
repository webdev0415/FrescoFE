import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.workspacepage || initialState;

export const selectWorkspacePage = createSelector(
  [selectDomain],
  workspacePageState => workspacePageState,
);
