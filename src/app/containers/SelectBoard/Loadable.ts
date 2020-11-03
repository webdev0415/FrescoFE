import { lazyLoad } from 'utils/loadable';

export const SelectBoard = lazyLoad(
  () => import('./index'),
  module => module.SelectBoard,
);
