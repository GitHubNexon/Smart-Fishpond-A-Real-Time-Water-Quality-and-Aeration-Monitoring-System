// src/lib/date.util.ts
import moment, { MomentInput } from 'moment';

/**
 * Common date format utilities
 * You can use these across your app.
 */

export const formatDate = {
  // Example: 2025-09-26
  isoDate: (date: MomentInput) => moment(date).format('YYYY-MM-DD'),

  // Example: Sep 26, 2025
  shortDate: (date: MomentInput) => moment(date).format('MMM DD, YYYY'),

  // Example: Friday, September 26, 2025
  longDate: (date: MomentInput) => moment(date).format('dddd, MMMM DD, YYYY'),

  // Example: 09/26/2025 10:45 AM
  dateTime: (date: MomentInput) => moment(date).format('MM/DD/YYYY hh:mm A'),

  // Example: Sep 26, 2025 • 10:45 AM
  readableDateTime: (date: MomentInput) =>
    moment(date).format('MMM DD, YYYY • hh:mm A'),

  // Example: 10:45:30
  timeOnly: (date: MomentInput) => moment(date).format('HH:mm:ss'),

  // Example: 2 hours ago / in 3 days
  relativeTime: (date: MomentInput) => moment(date).fromNow(),
};
