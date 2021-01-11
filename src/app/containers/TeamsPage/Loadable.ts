import { lazyLoad } from 'utils/loadable';

export const TeamsPage = lazyLoad(
  () => import('./index'),
  module => module.TeamsPage,
);
