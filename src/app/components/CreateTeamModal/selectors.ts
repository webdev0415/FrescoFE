import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.createTeam || initialState;

export const selectCreateTeam = createSelector(
  [selectDomain],
  createTeamState => createTeamState,
);
