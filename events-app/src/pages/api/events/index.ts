// pages/api/events/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createEvent } from '../hooks/events/createEvent';
import { getAllEvents } from '../hooks/events/getAllEvents';
import { eventBodySchema } from '../validation/validateEvent';

import { z } from 'zod';
import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
      bodyParser: false,
  },
};

interface Form {
  fields: any,
  files: any
}

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

        // Clean up the fields: array of strings are returned from formidable. Save it as just the string
        const cleanedFields = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));

        //add image to the cleanedFields obj if provided
        cleanedFields.image = files?.image?.[0];
        
        //validate req body
        eventBodySchema.parse(cleanedFields);

        const {title, date, location, fee, summary, description, isRecurring, recurrencePattern, image} = cleanedFields;

        let imageBinary = undefined;
        const imageType = files?.image?.[0].mimetype;
        const imageName = files?.image?.[0].originalFilename;
        if (image){
          imageBinary = await fs.readFile(image.filepath);

          console.log(Buffer.byteLength(imageBinary))
          await fs.unlink(image.filepath); //delete the temp image from disk
        }

        const { createEventRespnse } = await createEvent(title, date, location, description, summary, isRecurring, fee, recurrencePattern, imageBinary, imageType, imageName);

        // //no errors thrown
        return res.status(200).json({ success: true, data: createEventRespnse });

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
