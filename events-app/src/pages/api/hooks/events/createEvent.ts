import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";
import { RecurrencePattern } from "@/constants/constants";

export const createEvent = async (
    title: string,
    date: Date,
    location: string,
    description: string,
    summary: string,
    isRecurring: boolean,
    fee?: number,
    photoUrl?: string,
    recurrencePattern?: RecurrencePattern
) => {
    try {
        await connectToDatabase();

        const newEvent = new Event({
            title,
            date,
            location,
            description,
            summary,
            isRecurring,
            fee,
            photoUrl,
            recurrencePattern
        })

        const createEventRespnse = await newEvent.save();
        return { createEventRespnse };

    } catch (error: any) {
        console.error('Error creating event:', error);
        throw new Error(error.message);
    }    
}