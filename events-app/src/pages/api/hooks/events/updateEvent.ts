import { connectToDatabase } from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";

export const updateEvent = async (
    updatedEvent: IEvent
) => {
    try {
        await connectToDatabase();

        const updateEventRespnse = await Event.findByIdAndUpdate(
            {_id: updatedEvent._id},
            { $set: updatedEvent },
            {new: true}, //return updated object
        ).lean();

        return {updateEventRespnse};

    } catch (error:any) {
        console.error('Error updating event:', error);
        throw new Error(error.message);
    }    
}