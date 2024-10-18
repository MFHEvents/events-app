import { NextApiRequest, NextApiResponse } from 'next';
import { registerAttendee } from '../hooks/register/registerAttendee';
import { z } from 'zod';
import mongoose from 'mongoose';

// schema for validating body fields
export const registerAttendeeBodySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  eventId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "_id not provided or format is invalid.",
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "POST": {
      try {
        registerAttendeeBodySchema.parse(req.body); // validate req.body
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ success: false, error: err.issues })
        }
      }

      const { firstName, lastName, email, eventId } = req.body
      const { attendeeResponse, errorMsg } = await registerAttendee(firstName, lastName, email, eventId);

       if (errorMsg) {
        if (errorMsg === 'Unable to register: Event does not exist.') {
          return res.status(404).json({ success: false, error: errorMsg }) 
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