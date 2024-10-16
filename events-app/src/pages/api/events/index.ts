// pages/api/events/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import Event, { IEvent } from '../../../models/Event';

type Data = {
  success: boolean;
  data?: IEvent[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const events = await Event.find();
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Failed to fetch events' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
