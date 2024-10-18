import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectToDatabase, getBucket } from "@/lib/mongodb"

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
        const bucket = getBucket();

        if(!bucket){
            throw new Error("could not get image. bucket is not defined.")
        }
        const file = await bucket.find({_id: new mongoose.Types.ObjectId(eventId as string)}).toArray();
        
        if (!file || file.length == 0) {
          return res.status(404).json({ success: false, error: "Image does not exist" });
        }

        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(eventId as string));

        downloadStream.on('error', (err) => {
            throw new Error(err.message);
        });

        //TODO - update to use metadata
        res.setHeader('Content-Type', file[0].contentType || 'application/octet-stream'); // Fallback if contentType is undefined
        res.status(200);

        downloadStream.pipe(res);
        return;

      } catch (err: any) {
        return res.status(500).json({ success: false, error: `Failed to get image. ${err.message}` });
      }
    }

    default: {
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

  }
}
