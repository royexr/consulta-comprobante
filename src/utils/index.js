import { isEmptyObject, isValidEmail } from './validations';
import { exportDetailed, exportResume } from './ExportToExcel';

/**
 * Calculate the first and the last day of the current month
 */
function currentMonthRange() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return { firstDay, lastDay };
}

export {
  currentMonthRange,
  isEmptyObject,
  isValidEmail,
  exportDetailed,
  exportResume,
};
