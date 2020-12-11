/**
 *
 * Asynchronously loads the component for ShareModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CollaboratorModal = lazyLoad(
  () => import('./index'),
  module => module.CollaboratorModal,
);
