import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectToDatabase, getBucket } from "@/lib/mongodb"
import Event from "@/models/Event";

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
        await connectToDatabase();

        const event = await Event.findById(eventId).populate('registeredAttendees'); // Populate the registeredAttendees field

        if (!event) {
            return res.status(404).json({ success: false, error: `Failed to get attendees. Event does not exist.` });
        }

        return res.status(200).json({ success: true, data: event.registeredAttendees });
        
      } catch (err: any) {
        return res.status(500).json({ success: false, error: `Failed to get attendees. ${err.message}` });
      }
    }

    default: {
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

  }
}
