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
        return res
          .status(404)
          .json({ success: false, error: "Event does not exist" });
      }

      //get event from db
      const { getEventResponse, errorMsg } = await getEvent(eventId as string);

      if (errorMsg) {
        return res.status(500).json({ success: false, error: errorMsg });
      }

      if (getEventResponse) {
        return res.status(200).json({ success: true, data: getEventResponse });
      } else {
        return res
          .status(404)
          .json({ success: false, error: "Event does not exist" });
      }
    }

    case "PUT": {
      try {
        eventBodyWithIdSchema.parse(req.body); // Validate body
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ success: false, error: err.issues });
        }
      }

      const {updateEventRespnse, errorMsg} = await updateEvent(req.body);

      // if an error occured, send the error message
      if (errorMsg) {
        return res.status(500).json({ success: false, error: errorMsg })
      } else {
        // no error, create event successful
        return res.status(200).json({ success: true, data: updateEventRespnse })
      }
    }

    default: {
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }
  }
}
