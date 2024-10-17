// pages/api/attendees/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { registerAttendee } from '../hooks/register/registerAttendee';
import { getAllAttendees } from '../hooks/register/getAttendees';
import { z } from 'zod';

// schema for validating body fields
export const attendeeBodySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format")
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "GET": {
      const { getAttendeesResponse, errorMsg } = await getAllAttendees();

      if (errorMsg) {
        return res.status(500).json({ success: false, error: errorMsg })
      } else {
        return res.status(200).json({ success: true, data: getAttendeesResponse })
      }
    }

    case "POST": {
      try {
        attendeeBodySchema.parse(req.body); // validate req.body
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ success: false, error: err.issues })
        }
      }

      const { firstName, lastName, email, registeredEvents } = req.body
      const { attendeeResponse, errorMsg } = await registerAttendee(firstName, lastName, email, registeredEvents);

       if (errorMsg) {
        if (errorMsg === 'An attendee with this email already exists') {
          return res.status(409).json({ success: false, error: errorMsg }) 
        }
        return res.status(500).json({ success: false, error: errorMsg })
      } else {
        return res.status(201).json({ success: true, data: attendeeResponse })
      }
    }

    default: {
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  }
}