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

      const {title, date, location, fee, summary, description, isRecurring, photoUrl, recurrencePattern } = req.body
      const {createEventRespnse, errorMsg} = await createEvent(title, date, location, description, summary, isRecurring, fee, photoUrl, recurrencePattern);

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
