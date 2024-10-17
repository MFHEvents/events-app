import { connectToDatabase } from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";

export const createEvent = async (
    title: string,
    date: Date,
    location: string,
    description: string,
    summary: string,
    isRecurring: boolean,
    fee?: number,
    photoUrl?: string
) => {
    let createEventRespnse: IEvent | undefined = undefined;
    let errorMsg: string | undefined = undefined;

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
            photoUrl
        })

        createEventRespnse = await newEvent.save();
    } catch (error) {
        console.error('Error saving event:', error);
        errorMsg = `Error saving event: ${error}`
    }
    
    return {createEventRespnse, errorMsg}
}