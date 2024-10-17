import { RecurrencePattern } from '@/constants/constants';
import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for the Event document
export interface IEvent extends Document {
    title: string;
    date: Date;
    location: string;
    fee?: number;
    summary: string;
    description: string;
    isRecurring?: boolean;
    recurrencePattern?: RecurrencePattern;
    registeredAttendees?: Schema.Types.ObjectId[]; // Array of attendee IDs
    photoUrl?: string;
}

// Define the schema for the Event
const EventSchema: Schema<IEvent> = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    fee: { type: Number, required: false },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    isRecurring: { type: Boolean, required: false },
    recurrencePattern: {
        type: Schema.Types.Mixed, // Use Mixed to allow different recurrence patterns. verification will be done before adding to db
        required: false
    },
    registeredAttendees: [{
        type: Schema.Types.ObjectId,
        ref: 'Attendee',
        required: false
    }],
    photoUrl: { type: String, required: false },
});

// Export the Event model (reuse if already defined)
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
