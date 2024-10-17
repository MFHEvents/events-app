import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";

export const getEvent = async (eventId: string) => {
    try {
        await connectToDatabase();
        const getEventResponse = await Event.findOne({_id: eventId}); 
        return {getEventResponse}

    } catch (error: any) {
        console.error(`Error getting event ${eventId}: ${error}`);
        throw new Error(`Error getting event ${eventId}: ${error.message}`);
    }
}