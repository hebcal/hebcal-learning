import {gematriya} from '@hebcal/core';

/**
 * Gematriya without nikkud (geresh or gershayim)
 */
export function gematriyaNN(num: number | string): string {
  const s = gematriya(num);
  return s.replace(/[׳״]/g, '');
}
