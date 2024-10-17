import { connectToDatabase } from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";
import { FlattenMaps } from "mongoose";

export const updateEvent = async (
    updatedEvent: IEvent
) => {
    let updateEventRespnse:
      | (FlattenMaps<IEvent> & Required<{ _id: FlattenMaps<unknown> }>)
      | null = null;
    let errorMsg: string | undefined = undefined;

    try {
        await connectToDatabase();

        updateEventRespnse = await Event.findByIdAndUpdate(
            {_id: updatedEvent._id},
            { $set: updatedEvent },
            {new: true}, //return updated object
        ).lean();

    } catch (error) {
        console.error('Error updating event:', error);
        errorMsg = `Error updating event: ${error}`
    }
    
    return {updateEventRespnse, errorMsg}
}