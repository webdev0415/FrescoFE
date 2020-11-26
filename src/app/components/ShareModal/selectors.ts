import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.shareModal || initialState;

export const selectDashboard = createSelector(
  [selectDomain],
  shareModalState => shareModalState,
);
