import { NextApiRequest, NextApiResponse } from "next";
import { getEvent } from "../../hooks/events/getEvent";
import { extendEventBodySchema } from "../../validation/validateEvent";
import mongoose from "mongoose";
import { z } from 'zod';
import { updateEvent } from "../../hooks/events/updateEvent";
import { Form } from "..";

import formidable from "formidable";
import fs from "fs/promises";
import { IEvent } from "@/models/Event";

export const eventBodyWithIdSchema = extendEventBodySchema({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "_id not provided or format is invalid.",
  }),
});

export const config = {
  api: {
      bodyParser: false,
  },
};

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
        const form = formidable({ multiples: false,
          keepExtensions: true,
          maxFields: 10
        });
        
        //parse formData fields
        const formData: Promise<Form> = new Promise((resolve, reject) => {
          form.parse(req, async (err, fields, files) => {
            if (err) {
              reject("error");
            }
            resolve({ fields, files });
          });
        });
        const { fields, files } = await formData;
        
        console.log('ere')

        // Clean up the fields: array of strings are returned from formidable. Save it as just the string
        const cleanedFields = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));

        //add image to the cleanedFields obj if provided
        cleanedFields.image = files?.image?.[0];

        //validate req.body
        eventBodyWithIdSchema.parse(cleanedFields);

        let imageBinary = undefined;
        const imageType = files?.image?.[0].mimetype;
        const imageName = files?.image?.[0].originalFilename;
        if (cleanedFields.image){
          imageBinary = await fs.readFile(cleanedFields.image.filepath);

          await fs.unlink(cleanedFields.image.filepath); //delete the temp image from disk
        }

        const {updateEventRespnse} = await updateEvent(cleanedFields as IEvent, imageBinary, imageType, imageName);

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
