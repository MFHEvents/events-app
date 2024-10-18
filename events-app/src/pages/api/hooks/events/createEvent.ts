import { connectToDatabase, getBucket } from "@/lib/mongodb";
import Event from "@/models/Event";
import { RecurrencePattern } from "@/constants/constants";
import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from 'mongodb';


export const createEvent = async (
    title: string,
    date: Date,
    location: string,
    description: string,
    summary: string,
    isRecurring: boolean,
    fee?: number,
    recurrencePattern?: RecurrencePattern,
    imageBinary?: Buffer,
    imageType?: string,
    imageName?: string
) => {
    try {
        const eventId = new mongoose.Types.ObjectId();

        await connectToDatabase();
        const bucket = getBucket();

        let imageId;
        if (imageBinary && bucket && imageType && imageName) {
            imageId = await uploadFile(imageBinary, bucket, imageName, imageType, eventId);
        }
        
        if (imageBinary && !imageId) {
            // add verbose error messages. i.e imageName missing...
            throw new Error("file upload unsuccessful");
        }

        const newEvent = new Event({
            _id: eventId,
            title,
            date,
            location,
            description,
            summary,
            isRecurring,
            fee,
            recurrencePattern,
            imageId
        })

        const createEventRespnse = await newEvent.save();
        return { createEventRespnse };

    } catch (error: any) {
        console.error('Error creating event:', error);
        throw new Error(error.message);
    }    
}

const uploadFile = async (fileBuffer: Buffer, bucket: GridFSBucket, fileName: string, filetype: string, customId: ObjectId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(fileName, {
            contentType: filetype,
            id: customId
        });

        // Write the file buffer to the upload stream
        uploadStream.end(fileBuffer);

        // Resolve the promise when the upload is complete
        uploadStream.on('finish', () => {
            resolve(uploadStream.id);
        });

        // Reject the promise on error
        uploadStream.on('error', (err) => {
            reject(new Error('Error uploading file: ' + err.message));
        });
    });
};