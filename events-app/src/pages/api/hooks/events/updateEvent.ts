import { connectToDatabase, getBucket } from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";
import mongoose from "mongoose";
import { uploadFile } from "./createEvent";

export const updateEvent = async (
    updatedEvent: IEvent,
    imageBinary?: Buffer,
    imageType?: string,
    imageName?: string
) => {
    try {
        const eventId = new mongoose.Types.ObjectId(updatedEvent._id as string);

        await connectToDatabase();
        const bucket = getBucket();

        let imageId;
        if (imageBinary && bucket && imageType && imageName) {
            imageId = await uploadFile(imageBinary, bucket, imageName, imageType, eventId);
            updatedEvent.imageId = imageId as string;
        }
        
        if (imageBinary && !imageId) {
            // add verbose error messages. i.e imageName missing...
            throw new Error("file upload unsuccessful");
        }

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