import { NextApiRequest, NextApiResponse } from "next";
import { getEvent } from "../../hooks/events/getEvent";
import { extendEventBodySchema } from "../../validation/validateEvent";
import mongoose from "mongoose";
import { z } from 'zod';
import { updateEvent } from "../../hooks/events/updateEvent";

export const eventBodyWithIdSchema = extendEventBodySchema({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "_id not provided or format is invalid.",
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "GET": {
      const { eventId } = req.query;

      // invalid mongo id
      if (!mongoose.Types.ObjectId.isValid(eventId as string)) {
        return res.status(404).json({ success: false, error: "Invalid Event Id" });
      }

      try {
        //get event from db
        const { getEventResponse } = await getEvent(eventId as string);

        if (!getEventResponse) {
          return res.status(404).json({ success: false, error: "Event does not exist" });
        }

        return res.status(200).json({ success: true, data: getEventResponse });

      } catch (err: any) {
        return res.status(500).json({ success: false, error: `Failed to get event. ${err.message}` });
      }
    }

    case "PUT": {
      try {
        //validate req.body
        eventBodyWithIdSchema.parse(req.body);

        const {updateEventRespnse} = await updateEvent(req.body);

        //no errors thrown
        return res.status(200).json({ success: true, data: updateEventRespnse })

      } catch (err: any) {
        // Zod validation error
        if (err instanceof z.ZodError) {
          return res.status(400).json({ success: false, errors: err.issues });
        }

        console.error("Error updating event:", err.message);
        return res.status(500).json({ success: false, error: `Failed to update event. ${err.message}` });
      }
    }

    default: {
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  }
}
