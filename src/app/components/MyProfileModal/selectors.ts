import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.myProfile || initialState;

export const selectMyProfileModal = createSelector(
  [selectDomain],
  myProfileModalState => myProfileModalState,
);
