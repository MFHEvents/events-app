import { connectToDatabase } from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";

export const getAllEvents = async () => {
    let getEventsResponse: IEvent[] = [];
    let errorMsg: string | undefined = undefined;

    try {
        await connectToDatabase();
        getEventsResponse = await Event.find(); 

    } catch (error) {
        console.error('Error getting events:', error);
        errorMsg = `Error getting events: ${error}`
    }

    return {getEventsResponse, errorMsg}
}