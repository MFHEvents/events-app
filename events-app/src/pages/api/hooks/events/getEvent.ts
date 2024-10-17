import { connectToDatabase } from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";

export const getEvent = async (eventId: string) => {
    let getEventResponse: IEvent | null = null;
    let errorMsg: string | undefined = undefined;

    try {
        await connectToDatabase();
        getEventResponse = await Event.findOne({_id: eventId}); 

    } catch (error) {
        console.error(`Error getting event ${eventId}: ${error}`);
        errorMsg = `Error getting event ${eventId}: ${error}`;
    }

    return {getEventResponse, errorMsg}
}