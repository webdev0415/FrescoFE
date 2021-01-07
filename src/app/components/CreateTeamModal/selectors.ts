import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.createTeamModal || initialState;

export const selectCreateTeamModal = createSelector(
  [selectDomain],
  createTeamModalState => createTeamModalState,
);
