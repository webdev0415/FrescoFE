import { lazyLoad } from 'utils/loadable';

export const BillingsPage = lazyLoad(
  () => import('./index'),
  module => module.BillingsPage,
);
