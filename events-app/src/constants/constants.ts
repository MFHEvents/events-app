
export enum RecurrenceFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum Days {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday'
}

export enum Months {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December'
}

export type DailyRecurrence = {
  frequency: RecurrenceFrequency.Daily;
  startDate: Date;
  endDate?: Date;
  interval: number; //1 => everyday, 2 => every other day
}

export type WeeklyRecurrence = {
  frequency: RecurrenceFrequency.Weekly;
  startDate: Date;
  endDate?: Date;
  daysOfWeek: Days[];
  interval: number;
}

export type MonthlyRecurrence = {
  frequency: RecurrenceFrequency.Monthly;
  startDate: Date;
  endDate?: Date;
  dayOfMonth: number;
  interval: number;
}

export type YearlyRecurrence = {
  frequency: RecurrenceFrequency.Yearly;
  startDate: Date;
  endDate?: Date;
  month: Months;
  dayOfMonth: number;
  interval: number;
}

export type RecurrencePattern = DailyRecurrence | WeeklyRecurrence | MonthlyRecurrence | YearlyRecurrence;