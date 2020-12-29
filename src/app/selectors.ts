import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

/* istanbul ignore next */
const globalDomain = (state: RootState) => state.global || initialState;

/* istanbul ignore next */
export const selectToken = createSelector(
  [globalDomain],
  globalState => globalState.token,
);

/* istanbul ignore next */
export const selectUser = createSelector(
  [globalDomain],
  globalState => globalState.user,
);
