// pages/api/events/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createEvent } from '../hooks/events/createEvent';
import { getAllEvents } from '../hooks/events/getAllEvents';
import { eventBodySchema } from '../validation/validateEvent';

import { z } from 'zod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "GET": {
      try {
        const {getEventsResponse} = await getAllEvents();

        // no error, create event successful
        return res.status(200).json({ success: true, data: getEventsResponse })
        
      } catch (err: any) {
        console.error("Error getting events:", err.message);
        return res.status(500).json({ success: false, error: `Failed to get events. ${err.message}` });
      }
    }

    case "POST": {
      try {
        //validate req.body
        eventBodySchema.parse(req.body);

        const {title, date, location, fee, summary, description, isRecurring, photoUrl, recurrencePattern } = req.body
        const {createEventRespnse} = await createEvent(title, date, location, description, summary, isRecurring, fee, photoUrl, recurrencePattern);

        //no errors thrown
        return res.status(200).json({ success: true, data: createEventRespnse })

      } catch (err: any) {
        // Handle Zod validation error
        if (err instanceof z.ZodError) {
          return res.status(400).json({ success: false, errors: err.issues });
        }

        // Catch any other errors from createEvent
        console.error("Error creating event:", err.message);
        return res.status(500).json({ success: false, error: `Failed to create event. ${err.message}` });
      }
    }

    default: {
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  }
}
