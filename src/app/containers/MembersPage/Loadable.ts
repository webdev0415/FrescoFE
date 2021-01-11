import { lazyLoad } from 'utils/loadable';

export const MembersPage = lazyLoad(
  () => import('./index'),
  module => module.MembersPage,
);
