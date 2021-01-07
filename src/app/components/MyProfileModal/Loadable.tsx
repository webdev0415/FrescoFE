import { lazyLoad } from 'utils/loadable';

export const MyProfileModal = lazyLoad(
  () => import('./index'),
  module => module.MyProfileModal,
);
