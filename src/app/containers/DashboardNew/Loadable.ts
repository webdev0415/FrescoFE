/**
 *
 * Asynchronously loads the component for Dashboard
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DashboardNew = lazyLoad(
  () => import('./index'),
  module => module.DashboardNew,
);
