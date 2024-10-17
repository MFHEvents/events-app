import { connectToDatabase } from "@/lib/mongodb";
import Attendee, { IAttendee } from "@/models/Attendee";

export const registerAttendee = async (
    firstName: string,
    lastName: string,
    email: string,
    registeredEvents?: string[]
) => {
    let attendeeResponse: IAttendee | null = null;
    let errorMsg: string | undefined = undefined;
    let isNewAttendee: boolean = false;

    try {
        await connectToDatabase();

        const update = {
            firstName,
            lastName,
            $addToSet: { registeredEvents: { $each: registeredEvents || [] } }
        };

        const options = {
            new: true, // return the modified document rather than the original
            upsert: true, // create a new document if no document matches the query 
            setDefaultsOnInsert: true, // if this creates a new document, apply schema defaults
            runValidators: true // runs update validators on this command
        };

        attendeeResponse = await Attendee.findOneAndUpdate(
            { email },
            update,
            options
        );

        isNewAttendee = (attendeeResponse as any).isNew || false;

    } catch (error) {
        console.error('Error upserting attendee:', error);
        errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    }
    
    return { attendeeResponse, errorMsg, isNewAttendee }
}