import { RecurrenceFrequency, Days, Months } from "@/constants/constants";
import { z, ZodRawShape } from "zod";

const dateSchema = z.string().refine((value) => !isNaN(Date.parse(value)), {
  message: "Invalid date format",
});

const DailyRecurrenceSchema = z.object({
  frequency: z.literal(RecurrenceFrequency.Daily),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  interval: z.number().min(1, "Interval must be at least 1").int(),
});

const WeeklyRecurrenceSchema = z.object({
  frequency: z.literal(RecurrenceFrequency.Weekly),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  daysOfWeek: z
    .array(z.enum(Object.values(Days) as [Days, ...Days[]])) //how zod parses enum values...
    .nonempty(), 
  interval: z.number().min(1, "Interval must be at least 1").int(),
});

const MonthlyRecurrenceSchema = z.object({
  frequency: z.literal(RecurrenceFrequency.Monthly),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  dayOfMonth: z.number().min(1).max(31),
  interval: z.number().min(1, "Interval must be at least 1").int(),
});

const YearlyRecurrenceSchema = z.object({
  frequency: z.literal(RecurrenceFrequency.Yearly),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  month: z.enum(Object.values(Months) as [Months, ...Months[]]),
  dayOfMonth: z.number().min(1).max(31),
  interval: z.number().min(1, "Interval must be at least 1").int(),
});

// schema for validating event body fields
const baseEventBodySchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: dateSchema,
  location: z.string().min(1, "Location is required"),
  fee: z.number().optional(),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  isRecurring: z.union([z.boolean(), z.string()]).optional(),
  imageId: z.string().optional(),
  recurrencePattern: z
    .union([
      DailyRecurrenceSchema,
      WeeklyRecurrenceSchema,
      MonthlyRecurrenceSchema,
      YearlyRecurrenceSchema,
    ])
    .optional(),
});

// main eventBodySchema. //refine is used for the check that recurrencePattern is provided when isRecurring is true
export const eventBodySchema = baseEventBodySchema.refine(
  (data) => {
    // Check if isRecurring is true and recurrencePattern is not provided
    return !data.isRecurring || (data.isRecurring && data.recurrencePattern);
  },
  {
    message: "recurrencePattern is required when isRecurring is set.",
    path: ["recurrencePattern"],
  }
);

// adding additional checks to the eventBodySchema. i.e "_id" is passed to the api call body to get a specific event
// we cannot use .extend() on a refined schema so we have to manually get the base schema, add .extend() and the required .refine()
export const extendEventBodySchema = (schema: ZodRawShape) => {
  return baseEventBodySchema.extend(schema).refine(
    (data) => {
      return !data.isRecurring || (data.isRecurring && data.recurrencePattern);
    },
    {
      message: "recurrencePattern is required when isRecurring is set.",
      path: ["recurrencePattern"],
    }
  );
};
