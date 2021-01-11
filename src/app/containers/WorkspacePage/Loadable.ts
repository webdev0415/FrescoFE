import { lazyLoad } from 'utils/loadable';

export const WorkspacePage = lazyLoad(
  () => import('./index'),
  module => module.WorkspacePage,
);
