import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.selectBoard || initialState;

export const selectBoard = createSelector(
  [selectDomain],
  SelectBoardState => SelectBoardState,
);
