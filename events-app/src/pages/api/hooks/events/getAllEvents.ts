import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";

export const getAllEvents = async () => {
    try {
        await connectToDatabase();
        const getEventsResponse = await Event.find(); 
        return { getEventsResponse };

    } catch (error: any) {
        console.error('Error getting events:', error);
        throw new Error(error.message);
    }
}