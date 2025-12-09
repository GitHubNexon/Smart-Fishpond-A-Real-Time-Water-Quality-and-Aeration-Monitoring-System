import { ValueTransformer } from 'typeorm';
import { toZonedTime } from 'date-fns-tz';

export const DateTimeTransformer: ValueTransformer = {
  to: (value: Date) => value, // store as-is in DB
  from: (value: string | Date) => {
    if (!value) return null;
    const timeZone = 'Asia/Manila';
    // Convert DB timestamp to Manila timezone, but keep as Date object
    return toZonedTime(value, timeZone); // <-- returns a Date
  },
};
