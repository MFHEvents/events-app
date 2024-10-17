import { connectToDatabase } from "@/lib/mongodb";
import Attendee, { IAttendee } from "@/models/Attendee";

export const getAllAttendees = async () => {
    let getAttendeesResponse: IAttendee[] = [];
    let errorMsg: string | undefined = undefined;

    try {
        await connectToDatabase();
        getAttendeesResponse = await Attendee.find().populate('registeredEvents', 'title date'); 

    } catch (error) {
        console.error('Error getting attendees:', error);
        errorMsg = `Error getting attendees: ${error}`
    }

    return { getAttendeesResponse, errorMsg }
}