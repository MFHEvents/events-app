// pages/api/events/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import Event, { IEvent } from '../../../models/Event';

type Data = {
  success: boolean;
  data?: IEvent[];
  error?: string;
};

export default async function handler( req: NextApiRequest,res: NextApiResponse<Data>) {
  await connectToDatabase();
  
  switch (req.method) {
    case 'POST':
      try {
        const event = new Event(req.body); // Create new event
        await event.save();
        return res.status(200).json({ success: true});
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Error creating event' });
      }

    case 'GET':
      try {
        const events = await Event.find();
        return res.status(200).json({ success: true, data: events });
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Error fetching events' });
      }

    case 'DELETE':
      try {
        const { id } = req.query;
        await Event.findByIdAndDelete(id); // Delete event by ID
        return res.status(200).json({ success: true});
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Error deleting event' });
      }

    default:
      res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
