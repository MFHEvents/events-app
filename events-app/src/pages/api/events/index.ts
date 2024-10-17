// pages/api/events/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createEvent } from '../hooks/events/createEvent';
import { getAllEvents } from '../hooks/events/getAllEvents';
import { z } from 'zod';

// schema for validating body fields
const eventBodySchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
  }),
  location: z.string().min(1, "Location is required"),
  fee: z.number().optional(),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  isRecurring: z.boolean().optional(),
  photoUrl: z.string().url().optional(), 
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "GET": {
      const {getEventsResponse, errorMsg} = await getAllEvents();

      // if an error occured, send the error message
      if (errorMsg) {
        return res.status(500).json({ success: false, error: errorMsg })
      } else {
        // no error, create event successful
        return res.status(200).json({ success: true, data: getEventsResponse })
      }
    }

    case "POST": {
      try {
        eventBodySchema.parse(req.body); // Validate req.body
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ success: false, error: err.issues })
        }
      }

      const {title, date, location, fee, summary, description, isRecurring, photoUrl } = req.body
      const {createEventRespnse, errorMsg} = await createEvent(title, date, location, description, summary, isRecurring, fee, photoUrl);

      // if an error occured, send the error message
      if (errorMsg) {
        return res.status(500).json({ success: false, error: errorMsg })
      } else {
        // no error, create event successful
        return res.status(200).json({ success: true, data: createEventRespnse })
      }
    }

    default: {
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  }
}
